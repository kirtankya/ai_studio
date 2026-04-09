import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Samachar Gujrati',
  description: 'Terms and conditions for using the Samachar Gujrati platform.',
};

export default function TermsPage() {
  return (
    <div className="static-page">
      {/* Hero Banner */}
      <div className="static-page__hero">
        <span className="static-page__hero-badge">📜 Terms</span>
        <h1 className="static-page__hero-title">Terms of Service</h1>
        <p className="static-page__hero-subtitle">
          Please read these terms carefully before using the Samachar Gujrati platform. By accessing this website, you agree to be bound by these terms.
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
            <h2>Platform Nature &amp; Aggregation Disclaimer</h2>
          </div>
          <p>
            Samachar Gujrati is a digital news aggregator. We algorithmically collect, curate, and index content from publicly
            available RSS feeds and various third-party news publishers, most notably Divya Bhaskar. We do <strong>not</strong> manually
            author, edit, or claim ownership over the news articles displayed on this platform.
          </p>
          <p>
            All featured images, excerpts, and headlines are the intellectual property of the original publishers. We practice
            strict fair-use and ethical aggregation by explicitly displaying the name of the original source (e.g., &quot;Source: Divya Bhaskar&quot;).
            A direct &quot;Read Full Article&quot; link is strongly provided for every news piece, directing traffic back to the original source.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">2</span>
            <h2>License and Acceptable Use</h2>
          </div>
          <p>
            Unless otherwise stated, Samachar Gujrati and/or its licensors own the intellectual property rights for all software,
            UI design, database structures, and platform architecture on this website.
          </p>
          <div className="static-page__list-box">
            <h4>You must not:</h4>
            <ul>
              <li>Republish our specific website design or database structures</li>
              <li>Sell, rent, or sub-license our platform services</li>
              <li>Reproduce, duplicate or copy platform logic from Samachar Gujrati</li>
              <li>Engage in data scraping, data mining, or malicious cyber activities targeting our servers</li>
            </ul>
          </div>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">3</span>
            <h2>Content Accuracy &amp; Liability</h2>
          </div>
          <p>
            While we strive to index news from highly reputable sources, we do not verify the factual accuracy of the aggregated
            content. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy,
            reliability, or suitability of the news items. Reliance you place on such information is therefore strictly at your own risk.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">4</span>
            <h2>Takedown Policy (DMCA)</h2>
          </div>
          <p>
            If you are a publisher, author, or copyright owner and feel that our indexing of your publicly available content
            infringes upon your exclusive rights, or if you prefer not to be indexed by our platform, please reach out to our
            legal contact. We will honor your request and swiftly remove the content and blacklist your feed from our indexing engine.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">5</span>
            <h2>Governing Law</h2>
          </div>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India and the state of Gujarat.
            You irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>

        {/* CTA */}
        <div className="static-page__cta">
          <p>Questions about our terms?{" "}
            <Link href="/contact" className="static-page__inline-link">Contact us</Link>
          </p>
          <Link href="/" className="static-page__cta-btn">
            ← Back to Latest News
          </Link>
        </div>
      </div>
    </div>
  );
}
