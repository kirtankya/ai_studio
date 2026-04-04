import { supabase } from "@/lib/supabase";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import AdsenseBanner from "@/components/AdsenseBanner";

export const revalidate = 60;

async function getNewsByCategory(category, page = 1, pageSize = 11) {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

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

export default async function CategoryPage({ params, searchParams }) {
  const { slug: category } = params;
  const page = parseInt(searchParams?.page || "1");
  const news = await getNewsByCategory(category, page);

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

          <div className="pagination">
            {page > 1 && (
              <Link href={`/category/${category}/?page=${page - 1}`} className="btn-pagination">
                &larr; Previous
              </Link>
            )}
            <span className="page-indicator">
              Page {page}
            </span>
            {news.length === 11 && (
              <Link href={`/category/${category}/?page=${page + 1}`} className="btn-pagination">
                Next &rarr;
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
