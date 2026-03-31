import "./globals.scss";
import Link from "next/link";

export const metadata = {
  title: "AutoNews - Latest Indian Express Articles",
  description: "A fully automated news platform scraping the latest articles from The Indian Express.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <Link href="/" className="logo">
            AutoNews
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/category/india">India</Link>
            <Link href="/category/world">World</Link>
            <Link href="/category/cities">Cities</Link>
            <Link href="/category/technology">Tech</Link>
            <Link href="/category/live-news">Live News</Link>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-brand">
              <Link href="/" className="logo">AutoNews</Link>
              <p>Your automated source for real-time news across India and the globe. Powered by advanced scraping technology.</p>
            </div>
            <div className="footer-links">
              <h4>News Categories</h4>
              <nav>
                <Link href="/category/india">India</Link>
                <Link href="/category/world">World</Link>
                <Link href="/category/technology">Technology</Link>
                <Link href="/category/live-news">Live News</Link>
              </nav>
            </div>
            <div className="footer-legal">
              <h4>Quick Links</h4>
              <nav>
                <Link href="/">Home</Link>
                <Link href="/admin">Admin Login</Link>
              </nav>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} AutoNews AI. All rights reserved. Follow us on Social Media.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
