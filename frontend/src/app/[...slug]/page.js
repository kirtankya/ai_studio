import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
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

  const ogImageUrl = `/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category || 'News')}${article.image ? `&image=${encodeURIComponent(article.image)}` : ''}`;

  return {
    title: `${article.title} - Samachar Gujrati`,
    description: article.description || article.title,
    keywords: [article.category, "Gujarati news", "latest updates", "Samachar Gujrati"],
    authors: [{ name: article.source_name === 'divyabhaskar' ? 'Divya Bhaskar' : 'Indian Express' }],
    publisher: "Samachar Gujrati",
    alternates: {
      canonical: `/${slugPath}`,
    },
    openGraph: {
      title: article.title,
      description: article.description || article.title,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || article.title,
      images: [ogImageUrl],
    },
  };
}

export default async function GenericPage({ params }) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const categorySlug = article.category
    ? article.category.toLowerCase().replace(/\s+/g, '-')
    : null;

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
        {/* Dynamic NewsArticle JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "headline": article.title,
              "image": [article.image || `/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category || 'News')}`],
              "datePublished": article.published_date,
              "dateModified": article.published_date,
              "author": [{
                  "@type": "Organization",
                  "name": article.source_name === 'divyabhaskar' ? 'Divya Bhaskar' : 'Indian Express',
              }],
              "publisher": {
                "@type": "Organization",
                "name": "Samachar Gujrati",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://samarchar-gujrati.vercel.app/icon/512"
                }
              },
              "description": article.description || article.title
            })
          }}
        />

        {/* Dynamic BreadcrumbList JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://samarchar-gujrati.vercel.app/"
                },
                ...(categorySlug ? [{
                  "@type": "ListItem",
                  "position": 2,
                  "name": article.category,
                  "item": `https://samarchar-gujrati.vercel.app/category/${categorySlug}`
                }] : []),
                {
                  "@type": "ListItem",
                  "position": categorySlug ? 3 : 2,
                  "name": "Article",
                  "item": `https://samarchar-gujrati.vercel.app/${Array.isArray(slug) ? slug.join('/') : slug}`
                }
              ]
            })
          }}
        />

        {/* Breadcrumb */}
        <nav className="article-breadcrumb" aria-label="Breadcrumb" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.5rem',
          fontWeight: 600,
        }}>
          <Link href="/" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}>Home</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          {categorySlug && (
            <>
              <Link href={`/category/${categorySlug}`} style={{ color: 'var(--text-secondary)', transition: 'color 0.15s', textTransform: 'capitalize' }}>{article.category}</Link>
              <span style={{ opacity: 0.4 }}>›</span>
            </>
          )}
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Article</span>
        </nav>

        {article.is_live && (
          <div className="live-badge" style={{
            position: "static",
            marginBottom: "1rem",
            width: "fit-content",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "0.3rem 0.8rem",
            background: "var(--primary)",
            color: "white",
            fontSize: "0.72rem",
            fontWeight: 800,
            borderRadius: "var(--radius-full, 9999px)",
            textTransform: "uppercase",
          }}>Live Updates</div>
        )}
        <h1>{article.title}</h1>
        <div className="meta">
          <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{article.category}</span> &bull; <span>{new Date(article.published_date).toLocaleString()}</span>
        </div>

        {article.image && (
          <img src={article.image} alt={article.title} className="image" />
        )}

        <div className="desc" style={{ whiteSpace: "pre-wrap", fontSize: "1.15rem", lineHeight: "1.85", color: "var(--text-color)" }}>
          {article.content || article.description || "No content found for this article."}
        </div>

        <a href={article.url} target="_blank" rel="noopener noreferrer" className="original-link">
          Read Original Article →
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
