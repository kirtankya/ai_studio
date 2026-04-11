import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.scss";
import Script from "next/script";
import Header from "@/components/Header";
import NotificationListener from "@/components/NotificationListener";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";

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
        {/* Global Footer */}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
