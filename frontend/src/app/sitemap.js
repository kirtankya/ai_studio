export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samarchar-gujrati.vercel.app";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const staticRoutes = [
    { url: `${baseUrl}`, changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/category/national`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/category/international`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/category/gujarat`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/category/sports`, changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/category/business`, changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/category/live-news`, changeFrequency: "hourly", priority: 1 },
  ].map((route) => ({
    ...route,
    lastModified: new Date(),
  }));

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/news?select=url,published_date&order=published_date.desc&limit=500`,
      {
        headers: {
          apikey: supabaseKey,
        },
        cache: "force-cache",
      }
    );

    if (!res.ok) return staticRoutes;

    const articles = await res.json();

    const dynamicRoutes = articles.map((item) => ({
      url: `${baseUrl}/${item.url}`,
      lastModified: item.published_date || new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (err) {
    return staticRoutes;
  }
}