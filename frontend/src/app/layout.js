import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.scss";
import Link from "next/link";
import Script from "next/script";
import Header from "@/components/Header";
import NotificationListener from "@/components/NotificationListener";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
});

export const viewport = {
  themeColor: "#C62828",
};

export const metadata = {
  metadataBase: new URL("https://samarchar-gujrati.vercel.app"),
  title: "Samachar Gujrati | Premium Aggregated News Platform",
  description: "A fully automated real-time news platform scraping the latest articles from multiple top sources including Indian Express and Divya Bhaskar.",
  keywords: ["Gujarati news", "Gujarat latest news", "Samachar Gujrati", "Live updates", "Divya Bhaskar news", "Indian Express Gujarati"],
  authors: [{ name: "Samachar Gujrati Team" }],
  publisher: "Samachar Gujrati",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "5edafqodVKTivB9xOHmZHs3z8yu5yDNyJ0FjJJqZ7sA",
  },
  other: {
    "google-adsense-account": "ca-pub-2422158282423035",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="gu" className={`${jakarta.variable}`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2422158282423035"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-BPHXJ9W5SH`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BPHXJ9W5SH');
            `,
          }}
        />
      </head>
      <body className={jakarta.className}>
        <NotificationListener />
        <Header />
        <CookieConsent />
        <main className="container">
          {children}
        </main>
        <footer className="footer">
          {/* Footer CTA Banner */}
          <div className="footer-cta">
            <div className="footer-cta__inner">
              <span className="footer-cta__icon">📰</span>
              <div className="footer-cta__text">
                <h3>Stay Updated with Samachar Gujrati</h3>
                <p>Get breaking news, trending stories, and real-time coverage — all in one place.</p>
              </div>
              <Link href="/category/live-news" className="footer-cta__btn">
                Live News →
              </Link>
            </div>
          </div>

          <div className="footer-container">
            <div className="footer-brand">
              <Link href="/" className="logo">Samachar Gujrati</Link>
              <p className="footer-tagline">Your trusted digital news companion — delivering accurate, real-time updates across Gujarat, India, and the world.</p>
              <div className="footer-trust">
                <span>Breaking News</span>
                <span>Trending Topics</span>
                <span>Global Coverage</span>
              </div>
            </div>
            <div className="footer-links">
              <h4>Categories</h4>
              <nav>
                <Link href="/category/national">National</Link>
                <Link href="/category/international">International</Link>
                <Link href="/category/gujarat">Gujarat</Link>
                <Link href="/category/sports">Sports</Link>
                <Link href="/category/business">Business</Link>
                <Link href="/category/entertainment">Entertainment</Link>
                <Link href="/category/lifestyle">Lifestyle</Link>
                <Link href="/category/dharm-darshan">Dharm Darshan</Link>
                <Link href="/category/utility">Utility</Link>
                <Link href="/category/magazine">Magazine</Link>
              </nav>
            </div>
            <div className="footer-legal">
              <h4>Quick Links</h4>
              <nav>
                <Link href="/">Home</Link>
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/sitemap-news.xml">Sitemap</Link>
              </nav>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Samachar Gujrati. All rights reserved.</p>
            <p className="footer-bottom__credit">Built with ❤️ for Gujarat</p>
          </div>
        </footer>
        <BackToTop />
      </body>
    </html>
  );
}
