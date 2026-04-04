export const revalidate = 0; // Always generate fresh sitemap

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samarchar-gujrati.vercel.app";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sbuhfgnwoxlqiynlcxdp.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_8uyhPTGHnYoeZGK-rXdNwg_2UjEgAD1";

  // Static pages
  const staticRoutes = [
    { url: `${baseUrl}`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/category/national`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/category/international`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/category/gujarat`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/category/sports`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/category/business`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/category/live-news`, changeFrequency: "daily", priority: 0.9 },
  ].map((route) => ({
    ...route,
    lastModified: new Date().toISOString(),
  }));

  // Fetch all news articles directly via Supabase REST API (no SDK)
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/news?select=url,published_date&order=published_date.desc&limit=5000`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Sitemap fetch failed:", res.status, await res.text());
      return staticRoutes;
    }

    const articles = await res.json();

    const dynamicRoutes = articles.map((item) => {
      // Build the slug path exactly as the frontend does
      const slug =
        item.slug ||
        item.url
          .replace(/^https?:\/\/[^\/]+/, "")
          .replace(/^\/+/, "")
          .replace(/\/$/, "");

      return {
        url: `${baseUrl}/${slug}`,
        lastModified: item.published_date
          ? new Date(item.published_date).toISOString()
          : new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      };
    });

    return [...staticRoutes, ...dynamicRoutes];
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return staticRoutes;
  }
}
