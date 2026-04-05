import React from 'react';

export const metadata = {
  title: 'Terms of Service - Samachar Gujrati',
  description: 'Terms and conditions for using the Samachar Gujrati platform.',
};

export default function TermsPage() {
  return (
    <div className="article-page">
      <h1>Terms of Service</h1>
      <div className="desc">
        <p>Welcome to <strong>Samachar Gujrati</strong>. These terms and conditions outline the rules and regulations for the use of our website. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Samachar Gujrati if you do not agree to take all of the terms and conditions stated on this page.</p>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>1. Platform Nature & Aggregation Disclaimer</h3>
        <p>Samachar Gujrati is a digital news aggregator. We algorithmically collect, curate, and index content from publicly available RSS feeds and various third-party news publishers, most notably Divya Bhaskar. We do <strong>not</strong> manually author, edit, or claim ownership over the news articles displayed on this platform.</p>
        <p>All featured images, excerpts, and headlines are the intellectual property of the original publishers. We practice strict fair-use and ethical aggregation by explicitly displaying the name of the original source (e.g., "Source: Divya Bhaskar"). A direct "Read Full Article" link is strongly provided for every news piece, directing traffic back to the original source. We act merely as an intermediary platform for public information discovery.</p>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>2. License and Acceptable Use</h3>
        <p>Unless otherwise stated, Samachar Gujrati and/or its licensors own the intellectual property rights for all software, UI design, database structures, and platform architecture on this website. You may access this from Samachar Gujrati for your own personal use subjected to restrictions set in these terms and conditions.</p>
        <p>You must not:</p>
        <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Republish our specific website design or database structures.</li>
          <li style={{ marginBottom: '0.5rem' }}>Sell, rent, or sub-license our platform services.</li>
          <li style={{ marginBottom: '0.5rem' }}>Reproduce, duplicate or copy platform logic from Samachar Gujrati.</li>
          <li style={{ marginBottom: '0.5rem' }}>Engage in data scraping, data mining, or malicious cyber activities targeting our servers.</li>
        </ul>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>3. Content Accuracy & Liability</h3>
        <p>While we strive to index news from highly reputable sources, we do not verify the factual accuracy of the aggregated content. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the news items. Reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage arising from the use of the aggregated news.</p>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>4. Takedown Policy (DMCA)</h3>
        <p>If you are a publisher, author, or copyright owner and feel that our indexing of your publicly available content infringes upon your exclusive rights, or if you prefer not to be indexed by our platform, please reach out to our legal contact. We will honor your request and swiftly remove the content and blacklist your feed from our indexing engine.</p>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>5. Governing Law</h3>
        <p>These terms and conditions are governed by and construed in accordance with the laws of India and the state of Gujarat. You irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
      </div>
    </div>
  );
}
