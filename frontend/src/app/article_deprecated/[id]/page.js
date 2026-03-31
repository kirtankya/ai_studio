import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const revalidate = 60;

async function getArticle(id) {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching article ${id}:`, error);
      return null;
    }
    return data;
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

      <div className="desc" style={{ whiteSpace: "pre-wrap", fontSize: "1.15rem", lineHeight: "1.8", color: "#333" }}>
        {article.content || article.description || "No content found for this article."}
      </div>

      <a href={article.url} target="_blank" rel="noopener noreferrer" className="original-link" style={{ marginTop: "3rem" }}>
        Read Original Article on Indian Express
      </a>
    </div>
  );
}
