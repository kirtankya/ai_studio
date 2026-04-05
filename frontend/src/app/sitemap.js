import { supabase } from '@/lib/supabase';

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samarchar-gujrati.vercel.app";

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

  // Fetch all news articles via Supabase JS Client
  try {
    const { data: articles, error } = await supabase
      .from('news')
      .select('url, published_date')
      .order('published_date', { ascending: false })
      .limit(500);

    if (error) {
      console.error("Sitemap fetch failed:", error.message);
      return staticRoutes;
    }

    if (!articles) return staticRoutes;

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
          ? new Date(item.published_date)
          : new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      };
    });

    return [...staticRoutes, ...dynamicRoutes];
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return staticRoutes;
  }
}