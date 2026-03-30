import { notFound } from "next/navigation";

export const revalidate = 60;

async function getArticle(id) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/api/news/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch article ${id}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ArticlePage({ params }) {
  const { id } = params;
  const article = await getArticle(id);

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

      {article.description && (
        <p className="desc">{article.description}</p>
      )}

      {!article.description && (
        <p className="desc">No full description was scraped for this article. Please read the full article on the original site.</p>
      )}

      <a href={article.url} target="_blank" rel="noopener noreferrer" className="original-link">
        Read Original Article on Indian Express
      </a>
    </div>
  );
}
