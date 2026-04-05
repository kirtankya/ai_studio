import { supabase } from "@/lib/supabase";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import AdsenseBanner from "@/components/AdsenseBanner";

export const revalidate = 60;

const PAGE_SIZE = 11;

async function getNewsByCategory(category, page = 1) {
  try {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .ilike('category', category)
      .order('published_date', { ascending: false })
      .range(from, to);

    if (error) {
      console.error(`Supabase error for category ${category}:`, error);
      return [];
    }
    return data;
  } catch (error) {
    console.error(`Failed to fetch news for category ${category}:`, error);
    return [];
  }
}

async function getCategoryCount(category) {
  try {
    const { count, error } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
      .ilike('category', category);

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

export default async function CategoryPage({ params, searchParams }) {
  const { slug: category } = params;
  const page = parseInt(searchParams?.page || "1");

  const [news, totalCount] = await Promise.all([
    getNewsByCategory(category, page),
    getCategoryCount(category),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", borderBottom: "2px solid #eee", paddingBottom: "1rem", textTransform: "capitalize" }}>
        Category: {category.replace(/-/g, ' ')}
      </h1>
      
      <AdsenseBanner adSlot="9742948675" />

      {news.length === 0 ? (
        <p>No news found in this category.</p>
      ) : (
        <>
          <div className="grid">
            {/* First Card is an In-Feed Ad matching the blog ad style */}
            <div className="news-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: 'none', background: 'transparent', boxShadow: 'none' }}>
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
