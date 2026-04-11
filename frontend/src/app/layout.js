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
  title: "Samachar Gujrati | Latest Gujarati News, Local & Breaking News",
  description: "Read the latest and breaking news from Gujarat, India, and the world in Gujarati. Access 24/7 live updates on politics, sports, business, and entertainment from Gujarat's top news sources.",
  authors: [{ name: "Samachar Gujrati Team" }],
  publisher: "Samachar Gujrati",
  
  // Explicit Icons Array defined for ALL devices properly
  icons: {
    icon: [
      { url: '/icon/16', sizes: '16x16', type: 'image/png' },
      { url: '/icon/32', sizes: '32x32', type: 'image/png' },
      { url: '/icon/50', sizes: '50x50', type: 'image/png' },
      { url: '/icon/72', sizes: '72x72', type: 'image/png' },
      { url: '/icon/96', sizes: '96x96', type: 'image/png' },
      { url: '/icon/150', sizes: '150x150', type: 'image/png' },
      { url: '/icon/192', sizes: '192x192', type: 'image/png' },
      { url: '/icon/512', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon/57', sizes: '57x57', type: 'image/png' },
      { url: '/icon/76', sizes: '76x76', type: 'image/png' },
      { url: '/icon/114', sizes: '114x114', type: 'image/png' },
      { url: '/icon/120', sizes: '120x120', type: 'image/png' },
      { url: '/icon/144', sizes: '144x144', type: 'image/png' },
      { url: '/icon/152', sizes: '152x152', type: 'image/png' },
      { url: '/icon/180', sizes: '180x180', type: 'image/png' },
    ],
  },
  
  // Open Graph Tag (Facebook, LinkedIn, Discord etc.)
  openGraph: {
    title: "Samachar Gujrati",
    description: "Premium Aggregated News Platform giving you live updates from Gujarat and Beyond.",
    url: "https://samarchar-gujrati.vercel.app",
    siteName: "Samachar Gujrati",
    images: [{ url: "/icon/512", width: 512, height: 512 }],
    locale: "gu_IN",
    type: "website",
  },
  
  // Twitter Meta Tags
  twitter: {
    card: "summary",
    title: "Samachar Gujrati | Live News",
    description: "Stay informed 24/7 with the most trusted digital news platform in Gujarat.",
    images: ["/icon/512"],
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
