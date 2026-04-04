"""
Divya Bhaskar News Scraper
==========================
Scrapes news articles from Divya Bhaskar (https://www.divyabhaskar.co.in/)
using their official RSS feeds. Each feed provides:
  - title, link (source_url), description (full content), pubDate, media:content (image)

This is a single-pass approach — no need for a second stage to fetch descriptions,
since the RSS feeds already include the full article text.
"""

import requests
import re
import xml.etree.ElementTree as ET
from datetime import datetime
from email.utils import parsedate_to_datetime
import unicodedata
import time


# ─── Configuration ────────────────────────────────────────────────────────────

SOURCE_NAME = "divyabhaskar"
SOURCE_BASE_URL = "https://www.divyabhaskar.co.in"

# RSS feeds categorized — we scrape all of these each run
RSS_FEEDS = {
    "Gujarat":        "https://www.divyabhaskar.co.in/rss-v1--category-1035.xml",
    "National":       "https://www.divyabhaskar.co.in/rss-v1--category-1037.xml",
    "International":  "https://www.divyabhaskar.co.in/rss-v1--category-1038.xml",
    "Sports":         "https://www.divyabhaskar.co.in/rss-v1--category-970.xml",
    "Entertainment":  "https://www.divyabhaskar.co.in/rss-v1--category-12042.xml",
    "Business":       "https://www.divyabhaskar.co.in/rss-v1--category-969.xml",
    "Lifestyle":      "https://www.divyabhaskar.co.in/rss-v1--category-5029.xml",
    "Dharm Darshan":  "https://www.divyabhaskar.co.in/rss-v1--category-11256.xml",
    "Utility":        "https://www.divyabhaskar.co.in/rss-v1--category-10695.xml",
    "DvB Original":   "https://www.divyabhaskar.co.in/rss-v1--category-11879.xml",
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/xml, text/xml, application/rss+xml, */*;q=0.8',
    'Accept-Language': 'gu,en-US;q=0.9,en;q=0.8',
}

# XML namespaces used in the RSS
NAMESPACES = {
    'media': 'http://search.yahoo.com/mrss/',
    'atom': 'http://www.w3.org/2005/Atom',
}


# ─── Utility Functions ────────────────────────────────────────────────────────

def slugify(text):
    """Generate a URL-friendly slug from text."""
    if not text:
        return ""
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^\w\s-]', '', text).lower().strip()
    text = re.sub(r'[-\s]+', '-', text)
    return text


def get_slug_from_url(url):
    """Extract the path from a Divya Bhaskar URL to use as a local slug."""
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
        # Remove .html extension for cleaner slugs
        if path.endswith('.html'):
            path = path[:-5]
        return path
    except Exception:
        return ""


def parse_rss_date(date_str):
    """Parse an RSS pubDate string into an ISO 8601 string."""
    if not date_str:
        return datetime.utcnow().isoformat() + "Z"
    try:
        dt = parsedate_to_datetime(date_str.strip())
        return dt.isoformat()
    except Exception:
        # Fallback: try common patterns
        try:
            dt = datetime.strptime(date_str.strip(), "%a, %d %b %Y %H:%M:%S %z")
            return dt.isoformat()
        except Exception:
            return datetime.utcnow().isoformat() + "Z"


def clean_cdata(text):
    """Remove CDATA wrappers and clean whitespace from text."""
    if not text:
        return ""
    # Strip CDATA markers if present (shouldn't be after ET parsing, but safety)
    text = text.strip()
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_video_url_from_link(article_url):
    """
    Derive the video URL from the article URL.
    Divya Bhaskar pattern: /news/ → /video/ for video version
    """
    if not article_url:
        return None
    if '/news/' in article_url:
        video_url = article_url.replace('/news/', '/video/')
        if not video_url.endswith('?type=video'):
            video_url += '?type=video'
        return video_url
    return None


# ─── Core Scraping ─────────────────────────────────────────────────────────────

def parse_feed(feed_url, category_name):
    """
    Fetch and parse a single RSS feed. Returns a list of article dicts.
    
    Each RSS <item> contains:
      <title>          → title
      <link>           → source_url
      <description>    → full article content (used as description + content)
      <pubDate>        → publish_date
      <media:content>  → image_url
    """
    articles = []
    
    try:
        response = requests.get(feed_url, headers=HEADERS, timeout=20)
        response.raise_for_status()
        
        # Parse XML
        root = ET.fromstring(response.content)
        channel = root.find('channel')
        if channel is None:
            print(f"  ✗ No <channel> found in {category_name} feed")
            return articles
        
        items = channel.findall('item')
        print(f"  📰 {category_name}: Found {len(items)} articles")
        
        for item in items:
            try:
                # --- Title ---
                title_el = item.find('title')
                title = clean_cdata(title_el.text) if title_el is not None and title_el.text else None
                if not title or len(title) < 5:
                    continue
                
                # --- URL ---
                link_el = item.find('link')
                article_url = link_el.text.strip() if link_el is not None and link_el.text else None
                if not article_url:
                    continue
                # Ensure clean URL (no query params)
                article_url = article_url.split('?')[0].split('#')[0]
                
                # --- Description (full content from RSS) ---
                desc_el = item.find('description')
                description = ""
                if desc_el is not None and desc_el.text:
                    description = desc_el.text.strip()
                    # Clean excessive whitespace but keep paragraph breaks
                    description = re.sub(r'\n\s*\n', '\n\n', description)
                    description = re.sub(r' +', ' ', description).strip()
                
                # --- Published Date ---
                pub_date_el = item.find('pubDate')
                published_date = parse_rss_date(
                    pub_date_el.text if pub_date_el is not None else None
                )
                
                # --- Image URL ---
                image_url = None
                media_content = item.find('media:content', NAMESPACES)
                if media_content is not None:
                    image_url = media_content.get('url')
                
                # --- Video URL (derived from article URL pattern) ---
                video_url = extract_video_url_from_link(article_url)
                
                # --- Slug ---
                slug = get_slug_from_url(article_url)
                
                # --- Build short description if full content is very long ---
                short_description = description
                if len(description) > 500:
                    # Use first ~300 chars as summary
                    short_description = description[:300].rsplit(' ', 1)[0] + "..."
                
                # --- Determine if it's a live article ---
                is_live = 'LIVE' in title[:10] or '-live-' in article_url.lower()
                
                article = {
                    "source_name": SOURCE_NAME,
                    "title": title,
                    "slug": slug,
                    "url": article_url,
                    "image": image_url,
                    "video_url": video_url,
                    "description": short_description,
                    "content": description,  # Full content from RSS
                    "category": category_name,
                    "is_live": is_live,
                    "published_date": published_date,
                }
                
                articles.append(article)
                
            except Exception as e:
                print(f"    ✗ Error parsing item: {e}")
                continue
        
    except requests.exceptions.RequestException as e:
        print(f"  ✗ Network error fetching {category_name}: {e}")
    except ET.ParseError as e:
        print(f"  ✗ XML parse error for {category_name}: {e}")
    except Exception as e:
        print(f"  ✗ Unexpected error for {category_name}: {e}")
    
    return articles


def scrape():
    """
    Main scraper entry point.
    Fetches all configured RSS feeds and returns a combined list of articles.
    """
    print("=" * 60)
    print("Divya Bhaskar RSS Scraper")
    print("=" * 60)
    
    all_articles = []
    seen_urls = set()  # De-duplicate across feeds
    
    for category, feed_url in RSS_FEEDS.items():
        articles = parse_feed(feed_url, category)
        
        for article in articles:
            if article["url"] not in seen_urls:
                seen_urls.add(article["url"])
                all_articles.append(article)
        
        # Be polite — small delay between feed requests
        time.sleep(0.5)
    
    print(f"\n{'=' * 60}")
    print(f"Scraping Complete!")
    print(f"  Total unique articles: {len(all_articles)}")
    print(f"  Categories scraped: {len(RSS_FEEDS)}")
    print("=" * 60)
    
    return all_articles


# ─── Standalone Execution ──────────────────────────────────────────────────────

if __name__ == "__main__":
    import json
    
    results = scrape()
    
    print(f"\n{len(results)} articles scraped. Sample titles:")
    for r in results[:5]:
        print(f"  - [{r['category']}] {r['title'][:80]}...")
    
    # Save to file for debugging
    with open("divyabhaskar_output.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\nFull output saved to divyabhaskar_output.json")
    
    # Store in database
    try:
        import db
        if results:
            print("\nSaving to database...")
            inserted = db.insert_news(results)
            print(f"Successfully stored {inserted} articles in the database.")
    except Exception as e:
        print(f"Database storage error: {e}")
