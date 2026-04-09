import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us - Samachar Gujrati',
  description: 'Get in touch with the Samachar Gujrati team. Have a question, feedback, or content removal request? We are here to help.',
};

export default function ContactPage() {
  return (
    <div className="static-page">
      {/* Hero Banner */}
      <div className="static-page__hero">
        <span className="static-page__hero-badge">💬 Contact</span>
        <h1 className="static-page__hero-title">Contact Us</h1>
        <p className="static-page__hero-subtitle">
          Found a problem? Have a suggestion? Want your content removed? Whatever it is, just drop us an email and we&apos;ll get back to you.
        </p>
      </div>

      {/* Content */}
      <div className="static-page__body">
        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">📧</span>
            <h2>Reach Out by Email</h2>
          </div>
          <p>
            The quickest way to reach us is by email. Whether you want to report a broken link, give us feedback about the website, or request removal of copyrighted content — just write to us. We usually reply within 24 to 48 hours.
          </p>

          <div className="contact-card">
            <div className="contact-card__icon">✉️</div>
            <div className="contact-card__info">
              <span className="contact-card__label">Our Email</span>
              <a href="mailto:thepixellight025@gmail.com" className="contact-card__value">
                thepixellight025@gmail.com
              </a>
            </div>
          </div>
        </section>

        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">❓</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            <div className="faq-item">
              <h4>I found wrong or misleading information on an article. What should I do?</h4>
              <p>Send us the article link and tell us what looks wrong. We&apos;ll review it and either correct it or remove it from our platform. Keep in mind that we don&apos;t write the articles ourselves — they come from the original publishers like Divya Bhaskar. But we&apos;ll still take action on our end.</p>
            </div>
            <div className="faq-item">
              <h4>I&apos;m a publisher and I want my content removed. How?</h4>
              <p>Just email us with details about which articles or which feed you want removed. We respect content creators and will remove your content right away. We&apos;ll also block your feed from being scraped in the future.</p>
            </div>
            <div className="faq-item">
              <h4>Can I write articles or submit news to your platform?</h4>
              <p>Not right now. Samachar Gujrati is fully automated — all the news is collected from RSS feeds of major publishers. We don&apos;t accept user-submitted content at this time. But who knows, maybe in the future!</p>
            </div>
            <div className="faq-item">
              <h4>The site is loading slow or something looks broken. What do I do?</h4>
              <p>Try refreshing the page or clearing your browser cache. If the issue persists, email us with a screenshot and we&apos;ll fix it as soon as possible. We test on both mobile and desktop, but bugs can sneak through.</p>
            </div>
            <div className="faq-item">
              <h4>Why do I see ads on the site?</h4>
              <p>We use Google AdSense to cover our hosting and development costs. The ads help us keep the site free for everyone. We don&apos;t control which specific ads appear — that&apos;s handled by Google based on your browsing preferences.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="static-page__cta">
          <p>Don&apos;t hesitate to write to us — we read every email!</p>
          <Link href="/" className="static-page__cta-btn">
            ← Back to Latest News
          </Link>
        </div>
      </div>
    </div>
  );
}
