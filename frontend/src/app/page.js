import Link from "next/link";
import Image from "next/image";

export const revalidate = 60; // SSR with ISR every 60 seconds

async function getNews() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${apiUrl}/api/news`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
}

export default async function Home() {
  const news = await getNews();

  return (
    <div>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", borderBottom: "2px solid #eee", paddingBottom: "1rem" }}>
        Latest News
      </h1>

      {news.length === 0 ? (
        <p>No news found. Maybe the scraper hasn&apos;t run yet?</p>
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
                  <span>{item.category}</span> &bull; <span>{new Date(item.published_date).toLocaleDateString()}</span>
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
