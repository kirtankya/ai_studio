import os
import sqlite3
from typing import List, Dict, Any
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

USE_SUPABASE = bool(SUPABASE_URL and SUPABASE_KEY)

supabase: Client = None
if USE_SUPABASE:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

DB_FILE = "news.db"

def init_db():
    if not USE_SUPABASE:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT UNIQUE,
                url TEXT UNIQUE NOT NULL,
                image TEXT,
                description TEXT,
                content TEXT,
                category TEXT,
                published_date TEXT
            )
        ''')
        # Try to add slug column if it doesn't exist (primitive migration)
        try:
            cursor.execute('ALTER TABLE news ADD COLUMN slug TEXT UNIQUE')
        except:
            pass
        conn.commit()
        conn.close()

init_db()

def insert_news(news_list: List[Dict[str, Any]]):
    inserted = 0
    if not news_list:
        return 0
        
    if USE_SUPABASE:
        try:
            # Use upsert to update existing rows with full content if URL matches
            res = supabase.table("news").upsert(news_list, on_conflict="url").execute()
            inserted = len(res.data)
        except Exception as e:
            print("Supabase upsert error:", e)
    else:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        for news in news_list:
            try:
                cursor.execute('''
                    INSERT INTO news (title, slug, url, image, description, category, published_date, content)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(url) DO UPDATE SET
                    slug=excluded.slug,
                    description=excluded.description,
                    content=excluded.content,
                    image=excluded.image
                ''', (news.get("title"), news.get("slug"), news.get("url"), news.get("image"), news.get("description"), news.get("category"), news.get("published_date"), news.get("content")))
                inserted += 1
            except Exception as e:
                print("SQLite upsert error:", e)
        conn.commit()
        conn.close()
    return inserted

def get_all_news(page: int = 1, page_size: int = 12) -> List[Dict[str, Any]]:
    offset = (page - 1) * page_size
    if USE_SUPABASE:
        res = supabase.table("news").select("*").order("published_date", desc=True).range(offset, offset + page_size - 1).execute()
        return res.data
    else:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM news ORDER BY published_date DESC LIMIT ? OFFSET ?', (page_size, offset))
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

def get_news_by_category(category: str, page: int = 1, page_size: int = 12) -> List[Dict[str, Any]]:
    offset = (page - 1) * page_size
    if USE_SUPABASE:
        # Use ilike for case-insensitive match
        res = supabase.table("news").select("*").ilike("category", category).order("published_date", desc=True).range(offset, offset + page_size - 1).execute()
        return res.data
    else:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM news WHERE LOWER(category) = LOWER(?) ORDER BY published_date DESC LIMIT ? OFFSET ?', (category, page_size, offset))
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

def get_news_by_id(news_id: int) -> Dict[str, Any]:
    if USE_SUPABASE:
        res = supabase.table("news").select("*").eq("id", news_id).execute()
        return res.data[0] if res.data else None
    else:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM news WHERE id = ?', (news_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

def get_news_by_slug(slug: str) -> Dict[str, Any]:
    # We search by matching the slug pattern at the end of the original URL
    # or by reconstructing it based on the primary domain.
    if USE_SUPABASE:
        # Match URL that contains the slug
        res = supabase.table("news").select("*").ilike("url", f"%{slug}%").execute()
        return res.data[0] if res.data else None
    else:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        # Look for the slug path inside the URL column
        cursor.execute('SELECT * FROM news WHERE url LIKE ?', (f'%{slug}%',))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

def delete_news(news_id: int) -> bool:
    if USE_SUPABASE:
        res = supabase.table("news").delete().eq("id", news_id).execute()
        return len(res.data) > 0
    else:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM news WHERE id = ?', (news_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted
