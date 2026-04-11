import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable Next.js cache to serve fresh XML always

const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Returns W3C format without milliseconds: YYYY-MM-DDThh:mm:ss+00:00
  return date.toISOString().split('.')[0] + '+00:00';
};

function generateSiteMap(articles, baseUrl) {
  const staticRoutes = [
    { url: `${baseUrl}`, changeFreq: "hourly", priority: "1.0" },
    { url: `${baseUrl}/category/national`, changeFreq: "hourly", priority: "0.9" },
    { url: `${baseUrl}/category/international`, changeFreq: "hourly", priority: "0.9" },
    { url: `${baseUrl}/category/gujarat`, changeFreq: "hourly", priority: "0.9" },
    { url: `${baseUrl}/category/sports`, changeFreq: "hourly", priority: "0.8" },
    { url: `${baseUrl}/category/business`, changeFreq: "hourly", priority: "0.8" },
    { url: `${baseUrl}/category/live-news`, changeFreq: "hourly", priority: "1.0" },
  ].map((route) => ({
    ...route,
    lastMod: formatDate(new Date()),
  }));

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
      priority: "0.7",
    };
  });

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
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
      .order('published_date', { ascending: false });

    if (error) {
      console.error("Sitemap fetch failed:", error.message);
    }

    const xml = generateSiteMap(error ? [] : articles, baseUrl);

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error("Sitemap generation error:", err);
    const fallbackXml = generateSiteMap([], baseUrl);
    
    return new Response(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  }
}
