import Link from "next/link";
import Image from "next/image";

export default function NewsCard({ item, hideCategoryTag = false, index = 0 }) {
  const slug = item.slug || item.url.replace(/^https?:\/\/[^\/]+/, '').replace(/^\/+/, '').replace(/\/$/, '');

  // We assign a dynamic staggered animation delay class
  const staggerClass = index < 15 ? "stagger-enter" : "";

  return (
    <Link href={`/${slug}`} className={`news-card ${staggerClass}`}>
      <div className="image-wrapper">
        {item.is_live && <div className="live-badge">Live Now</div>}
        {item.image ? (
          <div className="image-scale">
            <Image 
              src={item.image} 
              alt={item.title} 
              fill
              unoptimized={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="image" 
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQVQYV2NgYGD4DwABBAEAcCBlCwAAAABJRU5ErkJggg=="
            />
          </div>
        ) : (
          <div className="image-scale skeleton" style={{ width: '100%', height: '100%' }}></div>
        )}
        {!hideCategoryTag && <div className="category-tag">{item.category || "News"}</div>}
      </div>
      
      <div className="content">
        <div className="meta">
          <span>{new Date(item.published_date || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
