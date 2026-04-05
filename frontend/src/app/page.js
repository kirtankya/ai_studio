import { supabase } from "@/lib/supabase";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import AdsenseBanner from "@/components/AdsenseBanner";

export const revalidate = 60;

const PAGE_SIZE = 11;

async function getNews(page = 1) {
  try {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_date', { ascending: false })
      .range(from, to);

    if (error) return [];
    return data;
  } catch (error) {
    return [];
  }
}

async function getTotalCount() {
  try {
    const { count, error } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true });

    if (error) return 0;
    return count || 0;
  } catch (error) {
    return 0;
  }
}

async function getLiveNews() {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_live', true)
      .order('published_date', { ascending: false })
      .limit(5);
    if (error) return [];
    return data;
  } catch (error) {
    return [];
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

export default async function Home({ searchParams }) {
  const page = parseInt(searchParams?.page || "1");
  const [allNews, totalCount, liveNews] = await Promise.all([
    getNews(page),
    getTotalCount(),
    page === 1 ? getLiveNews() : Promise.resolve([]),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="home-container">
      {/* Live News Section (Horizontal) */}
      {page === 1 && liveNews.length > 0 && (
        <section className="live-section">
          <div className="section-header">
            <div className="live-indicator">
              <span className="dot"></span>
              LIVE UPDATES
            </div>
          </div>
          <div className="live-ticker-container">
            {liveNews.map(item => {
               const slug = item.slug || item.url.replace(/^https?:\/\/[^\/]+/, '').replace(/^\/+/, '').replace(/\/$/, '');
               return (
                 <Link key={item.id} href={`/${slug}`} className="live-ticker-item">
                   <span className="ticker-category">{item.category}</span>
                   <span className="ticker-title">{item.title}</span>
                 </Link>
               );
            })}
          </div>
        </section>
      )}

      <div className="main-content">
        <AdsenseBanner adSlot="9742948675" />
        <h2 className="section-title">
          {page === 1 ? "Latest News Feed" : `Latest News - Page ${page}`}
        </h2>

        {allNews.length === 0 ? (
          <p>No news found. Maybe the scraper hasn&apos;t run yet?</p>
        ) : (
          <>
            <div className="grid">
              {/* First Card is an In-Feed Ad matching the blog ad style */}
              <div className="news-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: 'none', background: 'transparent', boxShadow: 'none' }}>
                <AdsenseBanner adSlot="7555769031" adFormat="fluid" />
              </div>

              {allNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {page > 1 && (
                  <Link href={`/?page=${page - 1}`} className="btn-pagination btn-prev">
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
                        href={`/?page=${p}`}
                        className={`page-number ${p === page ? 'active' : ''}`}
                      >
                        {p}
                      </Link>
                    )
                  )}
                </div>

                {page < totalPages && (
                  <Link href={`/?page=${page + 1}`} className="btn-pagination btn-next">
                    Next &rarr;
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
