import { supabase } from "@/lib/supabase";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import AdsenseBanner from "@/components/AdsenseBanner";

export const revalidate = 60;

async function getNews(page = 1, pageSize = 12) {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

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

export default async function Home({ searchParams }) {
  const page = parseInt(searchParams?.page || "1");
  const allNews = await getNews(page);
  const liveNews = page === 1 ? await getLiveNews() : [];

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
              {allNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>

            <div className="pagination">
              {page > 1 && (
                <Link href={`/?page=${page - 1}`} className="btn-pagination">
                  &larr; Previous
                </Link>
              )}
              <span className="page-indicator">
                Page {page}
              </span>
              {allNews.length === 12 && (
                <Link href={`/?page=${page + 1}`} className="btn-pagination">
                  Next &rarr;
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
