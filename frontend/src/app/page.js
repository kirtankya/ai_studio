import Link from "next/link";

export const revalidate = 60; // SSR with ISR every 60 seconds

async function getNews(page = 1) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    // We use our backend API to handle pagination and sorting correctly
    const res = await fetch(`${apiUrl}/api/news?page=${page}&size=12`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
}

export default async function Home({ searchParams }) {
  const page = parseInt(searchParams?.page || "1");
  const news = await getNews(page);

  return (
    <div>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", borderBottom: "2px solid #eee", paddingBottom: "1rem" }}>
        Latest News
      </h1>

      {news.length === 0 ? (
        <p>No news found. Maybe the scraper hasn&apos;t run yet?</p>
      ) : (
        <>
          <div className="grid">
            {news.map((item) => {
              // Extract the path from the full URL (domain replacement)
              const slug = item.url.replace(/^https?:\/\/[^\/]+/, '').replace(/\/$/, '');
              
              return (
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
                    {/* Proper internal link using domain replacement path */}
                    <Link href={`/${slug}`} className="read-more">
                      Read More &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination Controls */}
          <div className="pagination" style={{ marginTop: "3rem", display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
            {page > 1 && (
              <Link href={`/?page=${page - 1}`} className="btn-pagination">
                &larr; Previous
              </Link>
            )}
            <span style={{ padding: "0.5rem 1rem", background: "#eee", borderRadius: "4px", fontWeight: "bold" }}>
              Page {page}
            </span>
            {news.length === 12 && (
              <Link href={`/?page=${page + 1}`} className="btn-pagination">
                Next &rarr;
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
