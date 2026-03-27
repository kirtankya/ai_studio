const axios = require('axios');
const cheerio = require('cheerio');

async function scrape() {
  try {
    const { data } = await axios.get('https://indianexpress.com/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    const $ = cheerio.load(data);
    const articles = [];

    // The Indian Express uses heading tags wrapped around links for most articles
    $('h2 a, h3 a').each((i, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr('href');

      if (!url || !url.startsWith('http')) return;
      if (title.length < 15) return; // ignore short links/menu items

      const parent = $(el).closest('div');
      let img = parent.find('img').attr('src') || parent.find('img').attr('data-src');
      let desc = parent.find('p').text().trim();

      // Try extracting category from URL, e.g. https://indianexpress.com/article/cities/delhi/...
      let category = 'General';
      const parts = url.split('/');
      if (url.includes('/article/')) {
        const idx = parts.indexOf('article');
        if (parts.length > idx + 1) {
          category = parts[idx + 1];
        }
      }

      // Fallback for image mapping
      if (!img) img = null;
      if (!desc) desc = null;

      articles.push({
        title,
        url,
        image: img,
        description: desc,
        category,
        published_date: new Date().toISOString()
      });
    });

    // Deduplicate
    const unique = [];
    const urls = new Set();
    for (let a of articles) {
      if (!urls.has(a.url)) {
        urls.add(a.url);
        unique.push(a);
      }
    }

    console.log(JSON.stringify(unique, null, 2));
  } catch(e) {
    console.error(JSON.stringify({ error: e.message }));
    process.exit(1);
  }
}
scrape();
