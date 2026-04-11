import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable Next.js cache to serve fresh XML always

const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Returns W3C format without milliseconds: YYYY-MM-DDThh:mm:ss+00:00
  return date.toISOString().split('.')[0] + '+00:00';
};

function generateSiteMap(articles, baseUrl) {
  const dynamicRoutes = (articles || []).map((item) => {
    const slug =
      item.slug ||
      item.url
        .replace(/^https?:\/\/[^\/]+/, "")
        .replace(/^\/+/, "")
        .replace(/\/$/, "");

    return {
      url: `${baseUrl}/${slug}`,
      lastMod: item.published_date
        ? formatDate(item.published_date)
        : formatDate(new Date()),
      changeFreq: "daily",
      priority: "0.8", // Increased priority for news articles
    };
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${dynamicRoutes
  .map((route) => {
    return `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastMod}</lastmod>
    <changefreq>${route.changeFreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samarchar-gujrati.vercel.app";

  try {
    const { data: articles, error } = await supabase
      .from('news')
      .select('url, published_date, slug')
      .order('published_date', { ascending: false })
      .limit(1000); // good practice to limit sitemap URLs to 1000 at a time or handle pagination if getting too large

    if (error) {
      console.error("Sitemap fetch failed:", error.message);
    }

    const xml = generateSiteMap(error ? [] : articles, baseUrl);

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
