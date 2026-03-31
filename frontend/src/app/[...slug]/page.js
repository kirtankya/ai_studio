import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const revalidate = 60;

async function getArticleBySlug(slugPath) {
  try {
    // Join slug parts if it's an array (catch-all route)
    const slug = Array.isArray(slugPath) ? slugPath.join('/') : slugPath;

    // Search for the slug path inside the original url column
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .ilike('url', `%${slug}%`)
      .limit(1)
      .single();

    if (error || !data) return null;
    return data;
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
    <div className="article-page" style={{ position: "relative" }}>
      {article.is_live && <div className="live-badge" style={{ position: "static", marginBottom: "1rem", width: "fit-content" }}>Live Updates</div>}
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
