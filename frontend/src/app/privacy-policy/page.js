import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Samachar Gujrati',
  description: 'Read the privacy policy of Samachar Gujrati to understand how we handle your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="static-page">
      {/* Hero Banner */}
      <div className="static-page__hero">
        <span className="static-page__hero-badge">🔒 Privacy</span>
        <h1 className="static-page__hero-title">Privacy Policy</h1>
        <p className="static-page__hero-subtitle">
          At Samachar Gujrati, your privacy is our priority. This policy explains how we collect, use, and protect your information.
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
            <h2>Log Files</h2>
          </div>
          <p>
            Samachar Gujrati follows a standard procedure of using log files. These files log visitors when they visit websites.
            All hosting companies do this and a part of hosting services&apos; analytics. The information collected by log files
            include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp,
            referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally
            identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos;
            movement on the website, and gathering demographic information.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">2</span>
            <h2>Cookies and Web Beacons</h2>
          </div>
          <p>
            Like any other website, Samachar Gujrati uses &quot;cookies&quot;. These cookies are used to store information including
            visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to
            optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">3</span>
            <h2>Google DoubleClick DART Cookie</h2>
          </div>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site
            visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline
            the use of DART cookies by visiting the Google ad and content network Privacy Policy at:{" "}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="static-page__inline-link">
              Google Ads Privacy Policy
            </a>
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">4</span>
            <h2>Third-Party Privacy Policies</h2>
          </div>
          <p>
            Samachar Gujrati&apos;s Privacy Policy does not apply to other advertisers or external websites (including the publishers
            whose news we aggregate). Thus, we are advising you to consult the respective Privacy Policies of these third-party
            ad servers and news portals for more detailed information. It may include their practices and instructions about how
            to opt-out of certain options.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">5</span>
            <h2>Children&apos;s Information</h2>
          </div>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and
            guardians to observe, participate in, and/or monitor and guide their online activity. Samachar Gujrati does not
            knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>
        </section>

        <section className="static-page__section static-page__section--numbered">
          <div className="static-page__section-header">
            <span className="static-page__section-number">6</span>
            <h2>Consent</h2>
          </div>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </section>

        {/* CTA */}
        <div className="static-page__cta">
          <p>Have questions about our privacy practices?{" "}
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
