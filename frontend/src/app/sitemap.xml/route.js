import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable Next.js cache to serve fresh XML always

const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Returns W3C format without milliseconds: YYYY-MM-DDThh:mm:ss+00:00
  return date.toISOString().split('.')[0] + '+00:00';
};

function generateSiteMap(baseUrl) {
  const staticRoutes = [
    { url: `${baseUrl}`, changeFreq: "hourly", priority: "1.0" },
    { url: `${baseUrl}/category/national`, changeFreq: "hourly", priority: "0.9" },
    { url: `${baseUrl}/category/international`, changeFreq: "hourly", priority: "0.9" },
    { url: `${baseUrl}/category/gujarat`, changeFreq: "hourly", priority: "0.9" },
    { url: `${baseUrl}/category/sports`, changeFreq: "hourly", priority: "0.8" },
    { url: `${baseUrl}/category/business`, changeFreq: "hourly", priority: "0.8" },
    { url: `${baseUrl}/category/entertainment`, changeFreq: "hourly", priority: "0.8" },
    { url: `${baseUrl}/category/lifestyle`, changeFreq: "hourly", priority: "0.8" },
    { url: `${baseUrl}/category/dharm-darshan`, changeFreq: "hourly", priority: "0.8" },
    { url: `${baseUrl}/category/utility`, changeFreq: "hourly", priority: "0.8" },
    { url: `${baseUrl}/category/magazine`, changeFreq: "hourly", priority: "0.8" },
    { url: `${baseUrl}/category/live-news`, changeFreq: "hourly", priority: "1.0" },
  ].map((route) => ({
    ...route,
    lastMod: formatDate(new Date()),
  }));

  const allRoutes = [...staticRoutes];

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
    const xml = generateSiteMap(baseUrl);

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error("Sitemap generation error:", err);
    const fallbackXml = generateSiteMap(baseUrl);
    
    return new Response(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  }
}
