import Link from "next/link";

export default function NewsCard({ item, hideCategoryTag = false }) {
  const slug = item.slug || item.url.replace(/^https?:\/\/[^\/]+/, '').replace(/^\/+/, '').replace(/\/$/, '');

  return (
    <Link href={`/${slug}`} className="news-card">
      <div className="image-wrapper">
        {item.is_live && <div className="live-badge">Live Now</div>}
        {item.image ? (
          <img src={item.image} alt={item.title} className="image" />
        ) : (
          <div className="image-placeholder">
            <span className="logo-icon">📰</span>
          </div>
        )}
        {!hideCategoryTag && <div className="category-tag">{item.category}</div>}
      </div>
      
      <div className="content">
        <div className="meta">
          <span>{new Date(item.published_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="read-time">• {Math.ceil((item.content?.length || 1000) / 1000)} min read</span>
        </div>
        
        <h3>{item.title}</h3>
        
        {item.description && (
          <p className="desc">{item.description}</p>
        )}
        
        <div className="card-footer">
          <span className="read-more">Read Article <span className="arrow">&rarr;</span></span>
        </div>
      </div>
    </Link>
  );
}
