import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Samachar Gujrati',
  description: 'Our privacy policy explains what data we collect, how we use cookies, and your rights when you visit Samachar Gujrati.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="static-page">
      {/* Hero Banner */}
      <div className="static-page__hero">
        <span className="static-page__hero-badge">🔒 Privacy</span>
        <h1 className="static-page__hero-title">Privacy Policy</h1>
        <p className="static-page__hero-subtitle">
          We keep things simple — we don&apos;t ask for your personal information, and we don&apos;t sell anything. Here&apos;s exactly what happens when you visit our site.
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
            <h2>What We Collect (Not Much, Honestly)</h2>
          </div>
          <p>
            When you visit Samachar Gujrati, our server automatically logs some basic technical details — things like your IP address, which browser you&apos;re using, what time you visited, and which pages you looked at. This is standard stuff that every website on the internet does. It helps us understand how many people visit the site and which news categories are most popular.
          </p>
          <p>
            We <strong>do not</strong> collect your name, email, phone number, or any other personal details. You don&apos;t need to create an account or fill out any form to use this site.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">2</span>
            <h2>Cookies — What Are They and Why We Use Them</h2>
          </div>
          <p>
            Cookies are small text files that get saved on your device when you visit a website. We use cookies for two main things:
          </p>
          <p>
            <strong>1. Remembering your preferences:</strong> For example, when you accept our cookie notice, we save a cookie so we don&apos;t ask you again every time you visit.
          </p>
          <p>
            <strong>2. Ads:</strong> We show Google AdSense ads on our site to keep it free for everyone. Google may use cookies to show you ads based on your interests. You can control this through your Google account settings or by visiting{" "}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="static-page__inline-link">
              Google&apos;s Ad Settings
            </a>.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">3</span>
            <h2>Google AdSense and Third-Party Ads</h2>
          </div>
          <p>
            We use Google AdSense to display advertisements. Google uses something called a DART cookie to serve ads based on your previous visits to our site and other websites you&apos;ve been to. This helps show you more relevant ads instead of random ones.
          </p>
          <p>
            If you don&apos;t want personalized ads, you can opt out anytime at{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="static-page__inline-link">
              Google Ad Settings
            </a>. You can also install the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="static-page__inline-link">
              Google Analytics Opt-out Browser Add-on
            </a>{" "}
            if you prefer not to be tracked at all.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">4</span>
            <h2>Third-Party Websites</h2>
          </div>
          <p>
            Our site contains links to original news articles on publisher websites like Divya Bhaskar. Once you click on those links and leave our site, we have no control over what those websites do with your data. We&apos;d recommend checking their own privacy policies if you&apos;re curious.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">5</span>
            <h2>Kids Under 13</h2>
          </div>
          <p>
            We don&apos;t knowingly collect any personal information from children under 13 years old. If you&apos;re a parent and you think your child has somehow shared personal info through our site, please let us know and we&apos;ll delete it immediately.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">6</span>
            <h2>Browser Notifications</h2>
          </div>
          <p>
            We may ask for your permission to send browser notifications when new breaking news is published. This is completely optional — you can allow or block it, and you can change your mind anytime from your browser settings. We only send news alerts, nothing else.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">7</span>
            <h2>Changes to This Policy</h2>
          </div>
          <p>
            If we ever update this privacy policy, we&apos;ll change the &quot;Last updated&quot; date at the top. We don&apos;t expect major changes since we don&apos;t collect much data in the first place, but we want to be upfront about it.
          </p>
        </section>

        {/* CTA */}
        <div className="static-page__cta">
          <p>Got a question about your privacy?{" "}
            <Link href="/contact" className="static-page__inline-link">Drop us an email</Link> — we&apos;re happy to explain anything.
          </p>
          <Link href="/" className="static-page__cta-btn">
            ← Back to Latest News
          </Link>
        </div>
      </div>
    </div>
  );
}
