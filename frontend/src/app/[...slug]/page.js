import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AdsenseBanner from "@/components/AdsenseBanner";

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

export async function generateMetadata({ params }) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Samachar Gujrati",
    };
  }

  // Ensure slugPath is structured properly for the URL
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;

  return {
    title: `${article.title} - Samachar Gujrati`,
    description: article.description || article.title,
    alternates: {
      canonical: `/${slugPath}`,
    },
    openGraph: {
      title: article.title,
      description: article.description || article.title,
      images: article.image ? [{ url: article.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || article.title,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function GenericPage({ params }) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="article-layout">
      {/* Left Ad Column */}
      <aside className="ad-column left-ad">
        <div className="sticky-ad">
          <AdsenseBanner adSlot="7555769031" adFormat="autorelaxed" />
        </div>
      </aside>

      {/* Main Article Content */}
      <article className="article-page">
        {article.is_live && <div className="live-badge" style={{ position: "static", marginBottom: "1rem", width: "fit-content" }}>Live Updates</div>}
        <h1>{article.title}</h1>
        <div className="meta">
          <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{article.category}</span> &bull; <span>{new Date(article.published_date).toLocaleString()}</span>
        </div>

        {article.image && (
          <img src={article.image} alt={article.title} className="image" />
        )}

        <div className="desc" style={{ whiteSpace: "pre-wrap", fontSize: "1.15rem", lineHeight: "1.8", color: "var(--text-color)" }}>
          {article.content || article.description || "No content found for this article."}
        </div>

        <a href={article.url} target="_blank" rel="noopener noreferrer" className="original-link">
          Read Original Article on {article.source_name === 'divyabhaskar' ? 'Divya Bhaskar' : 'Indian Express'}
        </a>
      </article>

      {/* Right Ad Column */}
      <aside className="ad-column right-ad">
        <div className="sticky-ad">
          <AdsenseBanner adSlot="7555769031" adFormat="autorelaxed" />
        </div>
      </aside>
    </div>
  );
}
