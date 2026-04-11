import { supabase } from "@/lib/supabase";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import AdsenseBanner from "@/components/AdsenseBanner";

export const revalidate = 60;

const PAGE_SIZE = 12;

// Centralized category definitions for quick links
const CATEGORY_PILLS = [
  { href: "/category/national", icon: "🇮🇳", label: "National" },
  { href: "/category/international", icon: "🌍", label: "International" },
  { href: "/category/gujarat", icon: "🏠", label: "Gujarat" },
  { href: "/category/sports", icon: "⚽", label: "Sports" },
  { href: "/category/business", icon: "📊", label: "Business" },
  { href: "/category/entertainment", icon: "🎬", label: "Entertainment" },
  { href: "/category/lifestyle", icon: "💆", label: "Lifestyle" },
  { href: "/category/dharm-darshan", icon: "🕉️", label: "Dharm" },
  { href: "/category/utility", icon: "🔧", label: "Utility" },
  { href: "/category/magazine", icon: "📖", label: "Magazine" },
];

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

  // Split news: first item as hero, rest as grid
  const heroNews = page === 1 && allNews.length > 0 ? allNews[0] : null;
  const gridNews = page === 1 && heroNews ? allNews.slice(1) : allNews;

  return (
    <div className="home-container">
      {/* Live News Ticker */}
      {page === 1 && liveNews.length > 0 && (
        <section className="live-section" style={{ maxWidth: '1240px', margin: '0 auto 2.5rem', marginTop: '0' }}>
          <div className="section-header">
            <div className="live-indicator">
              <span className="dot"></span>
              LIVE
            </div>
          </div>
          <div className="live-ticker-container">
            <div className="ticker-track">
              {[...liveNews, ...liveNews].map((item, i) => {
                const slug = item.slug || item.url.replace(/^https?:\/\/[^\/]+/, '').replace(/^\/+/, '').replace(/\/$/, '');
                return (
                  <Link key={`${item.id}-${i}`} href={`/${slug}`} className="live-ticker-item">
                    <span className="ticker-category">{item.category}</span>
                    <span className="ticker-title">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="main-content">
        {/* Hero Section — only on page 1 */}
        {page === 1 && (
          <div className="home-hero">
            <div className="home-hero__welcome">
              <span className="home-hero__badge">Samachar Gujrati</span>
              <h1 className="home-hero__title">Stay Informed, Stay Ahead</h1>
              <p className="home-hero__desc">
                Your trusted source for real-time news from Gujarat, India, and around the world.
                Breaking stories, trending topics, and deep analysis — all in one place.
              </p>
              <div className="home-hero__stats">
                <div className="home-hero__stat">
                  <span className="home-hero__stat-number">{totalCount.toLocaleString()}+</span>
                  <span className="home-hero__stat-label">Articles</span>
                </div>
                <div className="home-hero__stat-divider" />
                <div className="home-hero__stat">
                  <span className="home-hero__stat-number">10+</span>
                  <span className="home-hero__stat-label">Categories</span>
                </div>
                <div className="home-hero__stat-divider" />
                <div className="home-hero__stat">
                  <span className="home-hero__stat-number">24/7</span>
                  <span className="home-hero__stat-label">Updates</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Featured / Hero Card */}
        {heroNews && (
          <section className="featured-section">
            <NewsCard item={heroNews} featured={true} />
          </section>
        )}

        <AdsenseBanner adSlot="9742948675" />

        {/* Category Quick Links */}
        {page === 1 && (
          <div className="category-pills">
            {CATEGORY_PILLS.map((pill) => (
              <Link key={pill.href} href={pill.href} className="category-pill">
                <span className="category-pill__icon">{pill.icon}</span> {pill.label}
              </Link>
            ))}
          </div>
        )}

        <div className="section-title-row">
          <h2 className="section-title">
            {page === 1 ? "Latest News" : `Latest News — Page ${page}`}
          </h2>
        </div>

        {gridNews.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">📭</span>
            <p className="empty-state__text">No news found. Maybe the scraper hasn&apos;t run yet?</p>
          </div>
        ) : (
          <>
            <div className="grid">
              {/* First Card is an In-Feed Ad */}
              <div className="news-card news-card--ad">
                <AdsenseBanner adSlot="7555769031" adFormat="fluid" />
              </div>

              {gridNews.map((item, idx) => (
                <NewsCard key={item.id} item={item} index={idx} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {page > 1 && (
                  <Link href={`/?page=${page - 1}`} className="btn-pagination btn-prev">
                    ← Previous
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
                    Next →
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
