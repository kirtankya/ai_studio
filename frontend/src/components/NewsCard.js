import Link from "next/link";
import Image from "next/image";

export default function NewsCard({ item, hideCategoryTag = false, featured = false }) {
  const slug = item.slug || item.url.replace(/^https?:\/\/[^\/]+/, '').replace(/^\/+/, '').replace(/\/$/, '');

  if (featured) {
    return (
      <Link href={`/${slug}`} className="featured-card">
        <div className="featured-card__image">
          {item.is_live && <div className="live-badge">Live</div>}
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              unoptimized={false}
              sizes="(max-width: 768px) 100vw, 60vw"
              style={{ objectFit: 'cover' }}
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQVQYV2NgYGD4DwABBAEAcCBlCwAAAABJRU5ErkJggg=="
            />
          ) : (
            <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
          )}
          <div className="featured-card__overlay" />
        </div>
        <div className="featured-card__content">
          <div className="featured-card__meta">
            <span className="featured-card__category">{item.category || "News"}</span>
            <span className="featured-card__date">
              {new Date(item.published_date || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="featured-card__read-time">• {Math.ceil((item.content?.length || 1000) / 1000)} min read</span>
          </div>
          <h2 className="featured-card__title">{item.title}</h2>
          {item.description && (
            <p className="featured-card__desc">{item.description}</p>
          )}
          <span className="featured-card__cta">Read Full Story →</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/${slug}`} className="news-card">
      <div className="image-wrapper">
        {item.is_live && <div className="live-badge">Live</div>}
        {item.image ? (
          <div className="image-scale" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Image
              src={item.image}
              alt={item.title}
              fill
              unoptimized={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQVQYV2NgYGD4DwABBAEAcCBlCwAAAABJRU5ErkJggg=="
            />
          </div>
        ) : (
          <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
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
          <span className="read-more">Read Full Story →</span>
          {item.source_name && (
            <span className="card-source">
              {item.source_name === 'divyabhaskar' ? 'Divya Bhaskar' : item.source_name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
