export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samarchar-gujrati.vercel.app";

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: "/admin",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin",
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-news.xml`,
    ],
  };
}
