import "./globals.scss";
import Link from "next/link";
import Script from "next/script";

export const metadata = {
  title: "The Daily Insight | Premium Aggregated News Platform",
  description: "A fully automated real-time news platform scraping the latest articles from multiple top sources including Indian Express and Divya Bhaskar.",
  verification: {
    google: "5edafqodVKTivB9xOHmZHs3z8yu5yDNyJ0FjJJqZ7sA",
  },
  other: {
    "google-adsense-account": "ca-pub-2422158282423035",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2422158282423035"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <nav className="navbar">
          <Link href="/" className="logo">
            <span className="logo-icon">📰</span> The Daily Insight
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/category/national">National</Link>
            <Link href="/category/international">International</Link>
            <Link href="/category/gujarat">Gujarat</Link>
            <Link href="/category/sports">Sports</Link>
            <Link href="/category/business">Business</Link>
            <Link href="/category/live-news" className="nav-live">Live News</Link>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-brand">
              <Link href="/" className="logo">The Daily Insight</Link>
              <p>Your premium automated source for real-time news across India and the globe. Powered by advanced Scraping AI.</p>
            </div>
            <div className="footer-links">
              <h4>Top Categories</h4>
              <nav>
                <Link href="/category/national">National</Link>
                <Link href="/category/international">International</Link>
                <Link href="/category/gujarat">Gujarat Local</Link>
                <Link href="/category/business">Business</Link>
              </nav>
            </div>
            <div className="footer-legal">
              <h4>Quick Links</h4>
              <nav>
                <Link href="/">Home</Link>
              </nav>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} The Daily Insight. All rights reserved. Follow us on Social Media.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
