import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from urllib.parse import urljoin
import unicodedata

def slugify(text):
    """Generate a URL-friendly slug from text."""
    if not text:
        return ""
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^\w\s-]', '', text).lower().strip()
    text = re.sub(r'[-\s]+', '-', text)
    return text

ARTICLE_URL_PATTERN = re.compile(r'https?://indianexpress\.com/article/[^/]+/[^/]+-\d+/?$')

def get_slug_from_url(url):
    """Extract the path from URL to use as local slug."""
    if not url:
        return ""
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        path = parsed.path
        if path.startswith('/'):
            path = path[1:]
        if path.endswith('/'):
            path = path[:-1]
        return path
    except:
        return ""

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Referer': 'https://www.google.com/'
}


def normalize_url(url):
    """Normalize a URL to absolute and clean form."""
    if not url:
        return None
    url = url.strip()
    if url.startswith('//'):
        url = 'https:' + url
    elif url.startswith('/'):
        url = 'https://indianexpress.com' + url
    # Remove query params and fragments for dedup
    url = url.split('?')[0].split('#')[0]
    # Ensure trailing slash for consistency
    if not url.endswith('/'):
        url += '/'
    return url


def extract_category_from_url(url, title=""):
    """Extract category from URL pattern /article/{category}/{slug}"""
    if "-live-updates" in url.lower() or "Live:" in title:
        return "Live News"
    try:
        parts = url.rstrip('/').split('/')
        if 'article' in parts:
            idx = parts.index('article')
            if len(parts) > idx + 1:
                return parts[idx + 1].replace('-', ' ').title()
    except:
        pass
    return 'General'


def get_article_details(url):
    """Fetch full article page and extract title, image, description, and full content."""
    try:
        res = requests.get(url, headers=HEADERS, timeout=15)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, 'html.parser')

        # --- Title ---
        title = None
        # Try h1 first (most reliable)
        h1 = soup.select_one('h1.native_story_title, h1.article-headline, h1[itemprop="headline"], h1')
        if h1:
            title = h1.get_text().strip()
        # Fallback to og:title
        if not title:
            og_title = soup.find('meta', property='og:title')
            if og_title:
                title = og_title.get('content', '').strip()
        if not title or len(title) < 10:
            return None  # Skip if no valid title

        # --- Image ---
        image = None
        # Try og:image first (high quality)
        og_image = soup.find('meta', property='og:image')
        if og_image:
            image = og_image.get('content', '').strip()
        if not image:
            # Try article image
            img_tag = soup.select_one('div.full-details img, div.story_details img, article img')
            if img_tag:
                image = (img_tag.get('src') or img_tag.get('data-src') or
                         img_tag.get('data-lazy-src') or img_tag.get('data-original'))
        if image and image.startswith('//'):
            image = 'https:' + image
        if image and not image.startswith('http'):
            image = None

        # --- Description ---
        description = None
        og_desc = soup.find('meta', property='og:description')
        if og_desc:
            description = og_desc.get('content', '').strip()
        if not description:
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc:
                description = meta_desc.get('content', '').strip()

        # --- Published Date ---
        published_date = None
        # Try datePublished meta
        date_meta = soup.find('meta', property='article:published_time')
        if date_meta:
            published_date = date_meta.get('content', '').strip()
        if not published_date:
            time_tag = soup.find('time', attrs={'datetime': True})
            if time_tag:
                published_date = time_tag.get('datetime', '').strip()
        if not published_date:
            published_date = datetime.utcnow().isoformat() + "Z"

        # --- Full Content ---
        content = extract_content(soup)

        # If content found but no description, use snippet
        if content and not description:
            description = content[:250] + "..."

        # If no content, use description as fallback
        if not content:
            content = description

        is_live = "live-updates" in url.lower() or (title and title.startswith("Live:"))
        category = extract_category_from_url(url, title)

        return {
            "title": title,
            "slug": get_slug_from_url(url),
            "url": url,
            "image": image,
            "description": description,
            "content": content,
            "category": category,
            "is_live": is_live,
            "published_date": published_date
        }

    except Exception as e:
        print(f"  ✗ Error fetching {url}: {e}")
        return None


def extract_content(soup):
    """Extract full article text from a BeautifulSoup parsed article page."""
    # Try multiple selectors in priority order
    selectors = [
        'div[itemprop="articleBody"]',
        'div.story_details',
        'div#pcl-full-content',
        'div.full-details',
        'div.story-details',
        'div.art-text',
        'div.articles',
        'article',
    ]

    # Check for live blog entries first
    live_entries = soup.select('div.liveblog-entry, div.live-blog-entry')
    if live_entries:
        entry_texts = []
        for entry in live_entries[:15]: # Get last 15 updates
            time_tag = entry.select_one('span.liveblog-entry-time, time')
            title_tag = entry.select_one('h2.liveblog-entry-title, h3')
            body_tag = entry.select_one('div.liveblog-entry-text, div.entry-content')
            
            entry_str = ""
            if time_tag: entry_str += f"[{time_tag.get_text().strip()}] "
            if title_tag: entry_str += f"**{title_tag.get_text().strip()}**\n"
            if body_tag: entry_str += body_tag.get_text().strip()
            
            if entry_str:
                entry_texts.append(entry_str)
        
        if entry_texts:
            return "\n\n---\n\n".join(entry_texts)

    article_body = None
    for selector in selectors:
        body = soup.select_one(selector)
        if body and len(body.get_text(strip=True)) > 150:
            article_body = body
            break

    if not article_body:
        article_body = soup.find('div', {'id': 'details'}) or soup.find('article')

    if article_body:
        # Remove junk elements
        junk_selectors = [
            'script', 'style', 'aside', 'nav', 'footer', 'header',
            'div.ad-box', 'div.related-articles', 'ul.social-share',
            'div.app-promo', 'div.ie-subscribe-box', 'div.story-tags',
            'div.appslink', 'div.custom-share', 'div.ev-meter-content',
            'div.storytags', 'div.share-social', 'div.o-story-tag',
            'div.ie2020-also-read', 'div.pcl-custom-share',
        ]
        for sel in junk_selectors:
            for junk in article_body.select(sel):
                junk.decompose()
        # Also decompose by tag
        for junk in article_body.find_all(['script', 'style', 'aside', 'nav', 'iframe', 'form']):
            junk.decompose()

        paragraphs = article_body.find_all('p')
        seen = set()
        texts = []
        for p in paragraphs:
            text = p.get_text().strip()
            # Filter out short, duplicate, or ad-like text
            if (len(text) > 25 and
                text not in seen and
                not text.startswith('Also Read') and
                not text.startswith('ALSO READ') and
                not text.startswith('Advertisement') and
                'Join our' not in text and
                'Telegram channel' not in text and
                'newsletter' not in text.lower()):
                seen.add(text)
                texts.append(text)

        full_text = "\n\n".join(texts)
        if len(full_text) > 100:
            return full_text

    # Last resort: grab all long paragraphs from the page
    all_p = soup.find_all('p')
    long_p = []
    seen = set()
    for p in all_p:
        text = p.get_text().strip()
        if len(text) > 60 and text not in seen:
            seen.add(text)
            long_p.append(text)
    if len(long_p) > 3:
        return "\n\n".join(long_p[:30])

    return None


def collect_article_urls(soup):
    """Find ALL article URLs from the homepage HTML."""
    urls = set()

    # Method 1: Find ALL <a> tags with href matching /article/ pattern
    for a_tag in soup.find_all('a', href=True):
        href = normalize_url(a_tag.get('href'))
        if href and ARTICLE_URL_PATTERN.match(href):
            urls.add(href)

    print(f"  Found {len(urls)} unique article URLs from homepage.")
    return list(urls)


def scrape():
    """Main scraper: fetch homepage, collect all article URLs, then scrape each article in full."""
    try:
        base_url = 'https://indianexpress.com/'

        print("=" * 60)
        print("Indian Express Full Scraper")
        print("=" * 60)

        # Step 1: Fetch homepage
        print("\n[Step 1] Fetching homepage...")
        response = requests.get(base_url, headers=HEADERS, timeout=25)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        print("  ✓ Homepage loaded successfully.")

        # Step 2: Collect all article URLs
        print("\n[Step 2] Collecting article URLs...")
        article_urls = collect_article_urls(soup)

        if not article_urls:
            print("  ✗ No article URLs found! The site structure may have changed.")
            return []

        # Step 3: Scrape each article in depth
        print(f"\n[Step 3] Scraping {len(article_urls)} articles in depth...")
        articles = []
        failed = 0

        for i, url in enumerate(article_urls):
            print(f"  [{i+1}/{len(article_urls)}] {url}")
            article_data = get_article_details(url)
            if article_data:
                articles.append(article_data)
                print(f"    ✓ {article_data['title'][:60]}...")
            else:
                failed += 1
                print(f"    ✗ Skipped (no content or error)")

        # Summary
        print("\n" + "=" * 60)
        print(f"Scraping Complete!")
        print(f"  Total URLs found: {len(article_urls)}")
        print(f"  Successfully scraped: {len(articles)}")
        print(f"  Failed/Skipped: {failed}")
        print("=" * 60)

        return articles

    except Exception as e:
        print(f"Main scrape error: {e}")
        return []


if __name__ == "__main__":
    results = scrape()
    print(f"\n{len(results)} articles scraped. Sample titles:")
    for r in results[:5]:
        print(f"  - {r['title']}")
    # Optionally save to file for debugging
    with open("scraped_output.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\nFull output saved to scraped_output.json")
