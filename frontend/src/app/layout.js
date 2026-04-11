import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.scss";
import Link from "next/link";
import Script from "next/script";
import Header from "@/components/Header";
import NotificationListener from "@/components/NotificationListener";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";

// Setup Google Font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
});

export const viewport = {
  themeColor: "#C62828",
};

// Global SEO Metadata Setup
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

// Footer Configuration - Centralized for easy updates
const FOOTER_CATEGORIES = [
  { href: "/category/national", label: "National" },
  { href: "/category/international", label: "International" },
  { href: "/category/gujarat", label: "Gujarat" },
  { href: "/category/sports", label: "Sports" },
  { href: "/category/business", label: "Business" },
  { href: "/category/entertainment", label: "Entertainment" },
  { href: "/category/lifestyle", label: "Lifestyle" },
  { href: "/category/dharm-darshan", label: "Dharm Darshan" },
  { href: "/category/utility", label: "Utility" },
  { href: "/category/magazine", label: "Magazine" },
];

const FOOTER_QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/sitemap-news.xml", label: "Sitemap" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable}`}>
      <head>
        {/* Google AdSense */}
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
        {/* Global Components */}
        <NotificationListener />
        <Header />
        <CookieConsent />
        
        {/* Main Content Render */}
        <main className="container">
          {children}
        </main>
        
        {/* Footer Section */}
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
            {/* Brand / About */}
            <div className="footer-brand">
              <Link href="/" className="logo">Samachar Gujrati</Link>
              <p className="footer-tagline">
                Your trusted digital news companion — delivering accurate, real-time updates across Gujarat, India, and the world.
              </p>
              <div className="footer-trust">
                <span>Breaking News</span>
                <span>Trending Topics</span>
                <span>Global Coverage</span>
              </div>
            </div>
            
            {/* Categories Mapping */}
            <div className="footer-links">
              <h4>Categories</h4>
              <nav>
                {FOOTER_CATEGORIES.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Quick Links Mapping */}
            <div className="footer-legal">
              <h4>Quick Links</h4>
              <nav>
                {FOOTER_QUICK_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
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
