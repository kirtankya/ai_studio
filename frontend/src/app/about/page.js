import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Samachar Gujrati',
  description: 'Learn about Samachar Gujrati — a free Gujarati news aggregation platform bringing you the latest from Gujarat, India, and the world.',
};

export default function AboutPage() {
  return (
    <div className="static-page">
      {/* Hero Banner */}
      <div className="static-page__hero">
        <span className="static-page__hero-badge">📖 About</span>
        <h1 className="static-page__hero-title">About Samachar Gujrati</h1>
        <p className="static-page__hero-subtitle">
          We started this platform with a simple idea — make it easier for Gujarati readers to find all their news in one place, without jumping between multiple websites.
        </p>
      </div>

      {/* Content */}
      <div className="static-page__body">
        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">🎯</span>
            <h2>Why We Built This</h2>
          </div>
          <p>
            If you&apos;re someone who reads Gujarati news daily, you probably know the struggle. You open Divya Bhaskar for Gujarat news, then switch to another site for sports, then another for business updates. It takes time, and half the day goes by just catching up.
          </p>
          <p>
            That&apos;s exactly why we created Samachar Gujrati. We pull in news from trusted sources like Divya Bhaskar and organize everything neatly — so you can read Gujarat, National, International, Sports, Business, Entertainment, and more, all from a single page. No app downloads, no sign-ups, no clutter. Just open the site and start reading.
          </p>
        </section>

        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">⚡</span>
            <h2>What You Get Here</h2>
          </div>
          <div className="static-page__features">
            <div className="static-page__feature-card">
              <span className="static-page__feature-emoji">🏠</span>
              <h4>Gujarat &amp; Local News</h4>
              <p>Get the latest from Ahmedabad, Surat, Rajkot, Vadodara, and every district. Updated round the clock.</p>
            </div>
            <div className="static-page__feature-card">
              <span className="static-page__feature-emoji">🇮🇳</span>
              <h4>National Coverage</h4>
              <p>Indian politics, government policies, economy, and all the major happenings across the country.</p>
            </div>
            <div className="static-page__feature-card">
              <span className="static-page__feature-emoji">🌍</span>
              <h4>World News</h4>
              <p>Stay connected with what&apos;s happening globally — from wars to weather, from tech to trade deals.</p>
            </div>
            <div className="static-page__feature-card">
              <span className="static-page__feature-emoji">📊</span>
              <h4>Sports, Business &amp; More</h4>
              <p>Cricket scores, stock market updates, Bollywood gossip, lifestyle tips, and spiritual content — all here.</p>
            </div>
          </div>
        </section>

        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">🏆</span>
            <h2>How This Works</h2>
          </div>
          <p>
            Our system automatically monitors RSS feeds from Divya Bhaskar and collects the latest published articles. Every few hours, fresh news gets added to the site. We don&apos;t write any of the articles ourselves — we simply collect them, organize them by category, and present them in a clean, easy-to-read format.
          </p>
          <p>
            Think of us like a newspaper stand that collects papers from different publishers and puts them all in one rack for you. The news comes from the original source, we just make it convenient for you to browse.
          </p>
        </section>

        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">🤝</span>
            <h2>Credit Where It&apos;s Due</h2>
          </div>
          <p>
            We have a lot of respect for the journalists and news teams at Divya Bhaskar and other publications. Every article on our site clearly shows the original source name. We also provide a direct link back to the original article so readers can visit the publisher&apos;s website and read the full story there.
          </p>
          <p>
            We don&apos;t claim any of the news content as our own. If any publisher wants their content removed from our platform, they can simply <Link href="/contact" className="static-page__inline-link">contact us</Link> and we&apos;ll take it down right away.
          </p>
        </section>

        {/* CTA */}
        <div className="static-page__cta">
          <p>Thanks for reading — now go catch up on the news!</p>
          <Link href="/" className="static-page__cta-btn">
            ← Back to Latest News
          </Link>
        </div>
      </div>
    </div>
  );
}
