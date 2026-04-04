import "./globals.scss";
import Link from "next/link";
import Script from "next/script";
import Header from "@/components/Header";

export const metadata = {
  title: "Samachar Gujrati | Premium Aggregated News Platform",
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
        <Header />
        <main className="container">
          {children}
        </main>
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-brand">
              <Link href="/" className="logo">Samachar Gujrati</Link>
              <div className="footer-desc">
                <p>Stay updated with the latest news from Gujarat, India, and around the world all in one place. We bring you accurate, trusted, and real-time updates across multiple categories.</p>
                <ul className="footer-features">
                  <li>📢 Breaking News</li>
                  <li>📊 Trending Topics</li>
                  <li>🌍 National & International Updates</li>
                  <li>📱 Simple and easy-to-understand content</li>
                </ul>
              </div>
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
            <p>&copy; {new Date().getFullYear()} Samachar Gujrati. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
