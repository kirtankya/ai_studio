import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us - Samachar Gujrati',
  description: 'Get in touch with the Samachar Gujrati team for inquiries, feedback, or support.',
};

export default function ContactPage() {
  return (
    <div className="static-page">
      {/* Hero Banner */}
      <div className="static-page__hero">
        <span className="static-page__hero-badge">💬 Contact</span>
        <h1 className="static-page__hero-title">Get in Touch</h1>
        <p className="static-page__hero-subtitle">
          We value our readers and are always here to listen. Whether you have a question, valuable feedback, or a partnership inquiry — we would love to hear from you.
        </p>
      </div>

      {/* Content */}
      <div className="static-page__body">
        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">📧</span>
            <h2>Email Us</h2>
          </div>
          <p>
            You can reach our team directly at the email address below. We try to respond to all inquiries within 24–48 hours.
          </p>

          <div className="contact-card">
            <div className="contact-card__icon">✉️</div>
            <div className="contact-card__info">
              <span className="contact-card__label">Email Address</span>
              <a href="mailto:thepixellight025@gmail.com" className="contact-card__value">
                thepixellight025@gmail.com
              </a>
            </div>
          </div>
        </section>

        <section className="static-page__section">
          <div className="static-page__section-header">
            <span className="static-page__section-icon">❓</span>
            <h2>Common Questions</h2>
          </div>
          <div className="faq-list">
            <div className="faq-item">
              <h4>How can I report incorrect news?</h4>
              <p>If you notice any inaccurate information, please email us with the article link and we will review it promptly.</p>
            </div>
            <div className="faq-item">
              <h4>Can I request content removal?</h4>
              <p>If you are the original publisher and want your content removed from our platform, please reach out via email and we will process it immediately.</p>
            </div>
            <div className="faq-item">
              <h4>Do you accept guest articles?</h4>
              <p>Currently, we are an automated aggregation platform and do not accept user-submitted content.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="static-page__cta">
          <p>We look forward to hearing from you!</p>
          <Link href="/" className="static-page__cta-btn">
            ← Back to Latest News
          </Link>
        </div>
      </div>
    </div>
  );
}
