import { notFound } from "next/navigation";

export const revalidate = 60;

async function getArticleBySlug(slugPath) {
  try {
    // Join slug parts if it's an array
    const slug = Array.isArray(slugPath) ? slugPath.join('/') : slugPath;
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${apiUrl}/api/news/slug/${slug}`, { cache: 'no-store' });
    
    if (res.ok) return await res.json();
    return null;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
}

export default async function GenericPage({ params }) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="article-page">
      <h1>{article.title}</h1>
      <div className="meta">
        <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{article.category}</span> &bull; <span>{new Date(article.published_date).toLocaleString()}</span>
      </div>

      {article.image && (
        <img src={article.image} alt={article.title} className="image" />
      )}

      <div className="desc" style={{ whiteSpace: "pre-wrap", fontSize: "1.15rem", lineHeight: "1.8", color: "#333" }}>
        {article.content || article.description || "No content found for this article."}
      </div>

      <a href={article.url} target="_blank" rel="noopener noreferrer" className="original-link" style={{ marginTop: "3rem" }}>
        Read Original Article on Indian Express
      </a>
    </div>
  );
}
