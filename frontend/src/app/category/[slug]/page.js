import { supabase } from "@/lib/supabase";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import AdsenseBanner from "@/components/AdsenseBanner";

export const revalidate = 60;

const PAGE_SIZE = 12;

// Map URL slugs to actual database category names
const SLUG_TO_CATEGORY = {
  "national": "National",
  "international": "International",
  "gujarat": "Gujarat",
  "sports": "Sports",
  "business": "Business",
  "entertainment": "Entertainment",
  "lifestyle": "Lifestyle",
  "dharm-darshan": "Dharm Darshan",
  "utility": "Utility",
  "dvb-original": "DvB Original",
  "magazine": "Magazine",
  "nrg": "NRG",
  "live-news": "live-news",  // special: handled by is_live filter
};

function getCategoryName(slug) {
  return SLUG_TO_CATEGORY[slug] || slug.replace(/-/g, ' ');
}

async function getNewsByCategory(slug, page = 1) {
  try {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // Special case: live-news filters by is_live flag
    if (slug === "live-news") {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_live', true)
        .order('published_date', { ascending: false })
        .range(from, to);
      if (error) return [];
      return data;
    }

    const categoryName = getCategoryName(slug);

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .ilike('category', categoryName)
      .order('published_date', { ascending: false })
      .range(from, to);

    if (error) {
      console.error(`Supabase error for category ${categoryName}:`, error);
      return [];
    }
    return data;
  } catch (error) {
    console.error(`Failed to fetch news for category ${slug}:`, error);
    return [];
  }
}

async function getCategoryCount(slug) {
  try {
    if (slug === "live-news") {
      const { count, error } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
        .eq('is_live', true);
      if (error) return 0;
      return count || 0;
    }

    const categoryName = getCategoryName(slug);

    const { count, error } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
      .ilike('category', categoryName);

    if (error) return 0;
    return count || 0;
  } catch (error) {
    return 0;
  }
}

function getPageNumbers(currentPage, totalPages) {
  const pages = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 3) {
    start = 2;
    end = Math.min(maxVisible, totalPages - 1);
  } else if (currentPage >= totalPages - 2) {
    start = Math.max(2, totalPages - maxVisible + 1);
    end = totalPages - 1;
  }

  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('...');

  pages.push(totalPages);
  return pages;
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const displayName = getCategoryName(slug);
  const capitalizedCategory = displayName.replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${capitalizedCategory} News - Latest Updates | Samachar Gujrati`,
    description: `Read the latest and breaking news from ${capitalizedCategory} category in Gujarati on Samachar Gujrati.`,
    keywords: [`${capitalizedCategory} news`, "Gujarati news", "Samachar Gujrati", "Latest news"],
    authors: [{ name: "Samachar Gujrati Team" }],
    publisher: "Samachar Gujrati",
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${capitalizedCategory} News - Latest Updates | Samachar Gujrati`,
      description: `Read the latest and breaking news from ${capitalizedCategory} category in Gujarati on Samachar Gujrati.`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug: category } = params;
  const page = parseInt(searchParams?.page || "1");
  const displayName = getCategoryName(category);

  const [news, totalCount] = await Promise.all([
    getNewsByCategory(category, page),
    getCategoryCount(category),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="main-content">
      <div className="section-title-row">
        <h1 className="section-title" style={{ textTransform: "capitalize" }}>
          {displayName} News
        </h1>
        <span className="section-title-count">{totalCount} articles</span>
      </div>
      
      <AdsenseBanner adSlot="9742948675" />

      {news.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">📭</span>
          <p className="empty-state__text">No news found in this category.</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {/* First Card is an In-Feed Ad */}
            <div className="news-card news-card--ad">
              <AdsenseBanner adSlot="7555769031" adFormat="fluid" />
            </div>
            
            {news.map((item) => (
              <NewsCard key={item.id} item={item} hideCategoryTag={true} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {page > 1 && (
                <Link href={`/category/${category}/?page=${page - 1}`} className="btn-pagination btn-prev">
                  &larr; Previous
                </Link>
              )}

              <div className="page-numbers">
                {pageNumbers.map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="page-dots">…</span>
                  ) : (
                    <Link
                      key={p}
                      href={`/category/${category}/?page=${p}`}
                      className={`page-number ${p === page ? 'active' : ''}`}
                    >
                      {p}
                    </Link>
                  )
                )}
              </div>

              {page < totalPages && (
                <Link href={`/category/${category}/?page=${page + 1}`} className="btn-pagination btn-next">
                  Next &rarr;
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
