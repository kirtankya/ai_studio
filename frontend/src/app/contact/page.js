import React from 'react';

export const metadata = {
  title: 'Contact Us - Samachar Gujrati',
  description: 'Get in touch with the Samachar Gujrati team for inquiries, feedback, or support.',
};

export default function ContactPage() {
  return (
    <div className="article-page">
      <h1>Contact Us</h1>
      <div className="desc">
        <p>We value our readers and are always here to listen. Whether you have a question, valuable feedback, or a partnership inquiry, we would love to hear from you.</p>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>Get in Touch</h3>
        <p>You can reach our team directly at the email address below. We try to respond to all inquiries as soon as possible.</p>

        <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'inline-block' }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            📧 <strong>Email:</strong> <a href="mailto:thepixellight025@gmail.com" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>thepixellight025@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
