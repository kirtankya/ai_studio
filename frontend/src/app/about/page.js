import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Samachar Gujrati',
  description: 'Learn more about Samachar Gujrati, your trusted premium news aggregator for Gujarat, National, and International news.',
};

export default function AboutPage() {
  return (
    <div className="static-page">
      {/* Hero Banner */}
      <div className="static-page__hero">
        <span className="static-page__hero-badge">📖 About</span>
        <h1 className="static-page__hero-title">About Samachar Gujrati</h1>
        <p className="static-page__hero-subtitle">
          Your trusted, real-time news aggregation platform delivering accurate and comprehensive coverage from Gujarat and beyond.
        </p>
      </div>

      {/* Content */}
      <div className="static-page__body">
        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">🎯</span>
            <h2>Our Mission</h2>
          </div>
          <p>
            In the digital age, information is abundant but finding verified and relevant news can be time-consuming.
            Our mission at Samachar Gujrati is to simplify your daily news consumption. We aim to empower the citizens
            of Gujarat and the global Gujarati diaspora by providing a unified, clutter-free platform where top headlines,
            breaking stories, and deep-dive analytics are instantly accessible.
          </p>
        </section>

        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">⚡</span>
            <h2>What We Do</h2>
          </div>
          <p>
            In today&apos;s fast-paced world, staying informed should not be difficult. Our platform is built on modern
            technology designed to monitor multiple trusted news sources and bring the most relevant stories directly to
            your screen.
          </p>
          <div className="static-page__features">
            <div className="static-page__feature-card">
              <span className="static-page__feature-emoji">🏠</span>
              <h4>Local &amp; Regional</h4>
              <p>Immediate updates from Ahmedabad, Surat, Rajkot, Vadodara, and every corner of Gujarat.</p>
            </div>
            <div className="static-page__feature-card">
              <span className="static-page__feature-emoji">🇮🇳</span>
              <h4>National News</h4>
              <p>Comprehensive coverage of Indian politics, economy, and social affairs.</p>
            </div>
            <div className="static-page__feature-card">
              <span className="static-page__feature-emoji">🌍</span>
              <h4>Global Updates</h4>
              <p>Keeping you informed with major international events and developments.</p>
            </div>
            <div className="static-page__feature-card">
              <span className="static-page__feature-emoji">📊</span>
              <h4>Sports &amp; Business</h4>
              <p>Live scores, market trends, and expert analysis all in one place.</p>
            </div>
          </div>
        </section>

        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">🏆</span>
            <h2>Why Choose Us?</h2>
          </div>
          <p>
            Unlike traditional newspapers and singular media outlets, we don&apos;t present a single viewpoint.
            By aggregating from a multitude of reliable sources, we offer our readers a 360-degree perspective on current events.
            We believe in speed, accuracy, and an uninterrupted user experience — which is why our platform is optimized for
            seamless reading on both mobile and desktop devices.
          </p>
        </section>

        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">🤝</span>
            <h2>Our Commitment to Publishers</h2>
          </div>
          <p>
            As an ethical aggregator, we deeply respect the hard work of journalists and media houses primarily like
            Divya Bhaskar. For every piece of news we aggregate, we explicitly mention the original publisher&apos;s
            name as the <strong>Source</strong>. We only display necessary excerpts to inform our readers and always
            provide a direct &quot;Read Full Article&quot; link back to the original website. This ensures that the
            original publishers receive their rightful credit, recognition, and direct traffic from our platform.
          </p>
        </section>

        {/* CTA */}
        <div className="static-page__cta">
          <p>Thank you for making <strong>Samachar Gujrati</strong> your daily habit.</p>
          <Link href="/" className="static-page__cta-btn">
            ← Back to Latest News
          </Link>
        </div>
      </div>
    </div>
  );
}
