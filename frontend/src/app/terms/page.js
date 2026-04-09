import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Samachar Gujrati',
  description: 'Terms and conditions for using the Samachar Gujrati news aggregation platform.',
};

export default function TermsPage() {
  return (
    <div className="static-page">
      {/* Hero Banner */}
      <div className="static-page__hero">
        <span className="static-page__hero-badge">📜 Terms</span>
        <h1 className="static-page__hero-title">Terms of Service</h1>
        <p className="static-page__hero-subtitle">
          These are the basic rules for using our website. Nothing complicated — just a few things we want to be clear about so everyone&apos;s on the same page.
        </p>
      </div>

      {/* Content */}
      <div className="static-page__body">
        <div className="static-page__last-updated">
          Last updated: April 2026
        </div>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">1</span>
            <h2>What This Website Actually Is</h2>
          </div>
          <p>
            Samachar Gujrati is a news aggregator — that means we collect news from other publishers (mainly Divya Bhaskar) and display them here in an organized way. We don&apos;t write the news articles ourselves. Every article you see on this site was originally published by the source mentioned.
          </p>
          <p>
            All headlines, images, and article content belong to their original publishers. We show the source name clearly on every article and always provide a link back to the original website. Our goal is to make it convenient for readers, not to take credit for someone else&apos;s work.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">2</span>
            <h2>What You Can and Can&apos;t Do</h2>
          </div>
          <p>
            You&apos;re welcome to browse the site, share article links with friends, and use it as your daily news source — that&apos;s exactly what it&apos;s built for.
          </p>
          <div className="static-page__list-box">
            <h4>However, please don&apos;t:</h4>
            <ul>
              <li>Copy our website design or try to recreate this platform</li>
              <li>Scrape or download our database using bots or automated tools</li>
              <li>Try to hack, overload, or mess with our servers</li>
              <li>Sell access to our content or try to make money off it without permission</li>
              <li>Use our platform for any illegal or harmful purpose</li>
            </ul>
          </div>
          <p>
            Basically — read the news, enjoy it, share it. Just don&apos;t try to clone the platform or do anything shady.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">3</span>
            <h2>Accuracy of News Content</h2>
          </div>
          <p>
            Since we pull in articles from external sources, we can&apos;t personally verify every single fact in every story. We trust that Divya Bhaskar and other sources do their own fact-checking, but mistakes can happen. If you spot something that looks wrong or misleading, please <Link href="/contact" className="static-page__inline-link">let us know</Link> and we&apos;ll look into it.
          </p>
          <p>
            We provide the news as-is for general information. Don&apos;t make major life decisions based solely on what you read here (or on any single news source, for that matter).
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">4</span>
            <h2>Content Removal Requests</h2>
          </div>
          <p>
            If you&apos;re a publisher, journalist, or content owner and you want your articles removed from our platform, just send us an email. We take these requests seriously and will remove the content quickly. We&apos;ll also make sure your feed is excluded from future scraping.
          </p>
          <p>
            We never want to cause problems for content creators. If something on our site bothers you, reach out — we&apos;ll sort it out.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">5</span>
            <h2>Ads on This Website</h2>
          </div>
          <p>
            We show Google AdSense ads to keep this website running — hosting, development, and maintenance all cost money, and ad revenue helps cover those costs. The ads you see are managed by Google, and we don&apos;t have direct control over which specific ads appear. If you see an ad that feels inappropriate, you can report it directly through Google&apos;s ad feedback option.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">6</span>
            <h2>Availability</h2>
          </div>
          <p>
            We do our best to keep the site running 24/7, but we can&apos;t guarantee 100% uptime. Sometimes things break, servers need updates, or the source feeds might be temporarily down. If the site is ever unavailable, it&apos;s almost always temporary and we work to fix things as fast as possible.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">7</span>
            <h2>Governing Law</h2>
          </div>
          <p>
            This website operates from India, and any legal matters would fall under Indian law and the jurisdiction of courts in Gujarat. We hope it never comes to that though — if there&apos;s ever an issue, just email us first and we&apos;ll work it out.
          </p>
        </section>

        {/* CTA */}
        <div className="static-page__cta">
          <p>Any questions about these terms?{" "}
            <Link href="/contact" className="static-page__inline-link">Send us an email</Link> — we don&apos;t bite.
          </p>
          <Link href="/" className="static-page__cta-btn">
            ← Back to Latest News
          </Link>
        </div>
      </div>
    </div>
  );
}
