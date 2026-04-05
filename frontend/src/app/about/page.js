import React from 'react';

export const metadata = {
  title: 'About Us - Samachar Gujrati',
  description: 'Learn more about Samachar Gujrati, your trusted premium news aggregator for Gujarat, National, and International news.',
};

export default function AboutPage() {
  return (
    <div className="article-page">
      <h1>About Us</h1>
      <div className="desc">
        <p>Welcome to <strong>Samachar Gujrati</strong>, the premier digital destination tailored specifically for the most accurate, real-time, and aggregated news coverage in the Gujarati language and beyond.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>Our Mission</h3>
        <p>In the digital age, information is abundant but finding verified and relevant news can be time-consuming. Our mission at Samachar Gujrati is to simplify your daily news consumption. We aim to empower the citizens of Gujarat and the global Gujarati diaspora by providing a unified, clutter-free platform where top headlines, breaking stories, and deep-dive analytics are instantly accessible.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>What We Do</h3>
        <p>Samachar Gujrati operates as an advanced automated news aggregator. Our custom-built, intelligent scraping engines continuously monitor trusted and leading news publishers—such as Divya Bhaskar, Indian Express, and others. We curate the content and present it in a visually elegant, easy-to-read format without altering the core truth of the original articles.</p>
        <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Local & Regional:</strong> Immediate updates from Ahmedabad, Surat, Rajkot, Vadodara, and every corner of Gujarat.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>National:</strong> Comprehensive coverage of Indian politics, economy, and social affairs.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Global:</strong> Keeping you informed with major international events.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Sports & Business:</strong> Live scores, market trends, and expert analysis.</li>
        </ul>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>Why Choose Us?</h3>
        <p>Unlike traditional newspapers and singular media outlets, we don't present a single viewpoint. By aggregating from a multitude of reliable sources, we offer our readers a 360-degree perspective on current events. We believe in speed, accuracy, and an uninterrupted user experience—which is why our platform is optimized for seamless reading on both mobile and desktop devices.</p>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>Our Commitment to Publishers</h3>
        <p>As an ethical aggregator, we deeply respect the hard work of journalists and media houses primarily like Divya Bhaskar. For every piece of news we aggregate, we explicitly mention the original publisher's name as the <strong>Source</strong>. We only display necessary excerpts to inform our readers and always provide a direct "Read Full Article" link back to the original website. This ensures that the original publishers receive their rightful credit, recognition, and direct traffic from our platform.</p>

        <p style={{ marginTop: '2rem', fontWeight: 'bold' }}>Thank you for making Samachar Gujrati your daily habit. Stay informed, stay ahead.</p>
      </div>
    </div>
  );
}
