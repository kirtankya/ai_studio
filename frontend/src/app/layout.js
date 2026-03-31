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
            <Link href="/admin">Admin</Link>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
