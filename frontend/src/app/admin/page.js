"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Check token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      fetchNews();
    }
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false });
      if (data) {
        setNews(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Static client-side check
    const STATIC_ADMIN = "thepixellight025@gmail.com";
    const STATIC_PASS = "ThePixelLight@025";

    if (username === STATIC_ADMIN && password === STATIC_PASS) {
      setToken("true");
      localStorage.setItem("adminToken", "true");
      fetchNews();
    } else {
      setMessage("Invalid credentials (static check)");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  const handleScrape = async () => {
    setLoading(true);
    setMessage("Scraping started... please wait.");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/admin/scrape`, {
        method: "POST"
      });
      const data = await res.json();
      setMessage(data.message || "Scraped successfully.");
      fetchNews();
    } catch (err) {
      setMessage("Error running scraper.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/admin/news/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setNews(news.filter(n => n.id !== id));
      } else {
        alert("Failed to delete article");
      }
    } catch (err) {
      alert("Error deleting article");
    }
  };
  if (!token) {
    return (
      <div className="admin-parent">
        <div style={{ maxWidth: 400, margin: "4rem auto", padding: "2rem", background: "white", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
                required
              />
            </div>
            {message && <p style={{ color: "red", fontSize: "0.9rem" }}>{message}</p>}
            <button type="submit" disabled={loading} style={{ background: "var(--primary-color)", color: "white", padding: "0.75rem", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: "bold" }}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-parent">
      <div className="admin-panel">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={handleScrape} disabled={loading}>
            {loading ? "Scraping..." : "Trigger Scraper"}
          </button>
          <button onClick={handleLogout} style={{ background: "#555" }}>Logout</button>
        </div>
      </div>

      {message && <p style={{ marginBottom: "1rem", padding: "1rem", background: "#e8f5e9", color: "#2e7d32", borderRadius: 4 }}>{message}</p>}

      <h3>Manage Articles ({news.length})</h3>
      <div style={{ overflowX: "auto", marginTop: "1rem" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => {
              const slug = item.url.replace(/^https?:\/\/[^\/]+/, '').replace(/\/$/, '');
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {item.is_live ? (
                      <span style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "0.8rem", border: "1px solid #d32f2f", padding: "2px 4px", borderRadius: 4 }}>LIVE</span>
                    ) : (
                      <span style={{ color: "#777", fontSize: "0.8rem" }}>Static</span>
                    )}
                  </td>
                  <td style={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {/* Consistent slug-based link */}
                    <Link href={`/${slug}`} target="_blank" style={{ color: "var(--primary-color)" }}>
                      {item.title}
                    </Link>
                  </td>
                  <td style={{ textTransform: "capitalize" }}>{item.category}</td>
                  <td>{new Date(item.published_date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(item.id)} style={{ background: "#d32f2f", padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {news.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>No articles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
