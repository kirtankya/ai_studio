import Link from "next/link";
import Image from "next/image";

export const revalidate = 60; // SSR with ISR every 60 seconds

async function getNewsByCategory(category) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/api/news/category/${category}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch news for category ${category}:`, error);
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const news = await getNewsByCategory(slug);

  return (
    <div>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", borderBottom: "2px solid #eee", paddingBottom: "1rem", textTransform: "capitalize" }}>
        Category: {slug}
      </h1>

      {news.length === 0 ? (
        <p>No news found in this category.</p>
      ) : (
        <div className="grid">
          {news.map((item) => (
            <div key={item.id} className="news-card">
              {item.image ? (
                <img src={item.image} alt={item.title} className="image" />
              ) : (
                <div className="image" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                  No Image Available
                </div>
              )}
              <div className="content">
                <h3>{item.title}</h3>
                <div className="meta">
                  <span>{new Date(item.published_date).toLocaleDateString()}</span>
                </div>
                {item.description && (
                  <p className="desc">{item.description}</p>
                )}
                <Link href={`/article/${item.id}`} className="read-more">
                  Read More &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
