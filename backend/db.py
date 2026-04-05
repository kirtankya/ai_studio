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

# Use /tmp for SQLite on Vercel due to read-only filesystem (prevents crash)
DB_FILE = "/tmp/news.db" if os.environ.get("VERCEL") else "news.db"

def init_db():
    if not USE_SUPABASE:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_name TEXT DEFAULT 'indianexpress',
                title TEXT NOT NULL,
                slug TEXT UNIQUE,
                url TEXT UNIQUE NOT NULL,
                image TEXT,
                video_url TEXT,
                description TEXT,
                content TEXT,
                category TEXT,
                is_live INTEGER DEFAULT 0,
                published_date TEXT
            )
        ''')
        # Try to add columns if they don't exist (primitive migration)
        for col_stmt in [
            'ALTER TABLE news ADD COLUMN slug TEXT UNIQUE',
            'ALTER TABLE news ADD COLUMN is_live INTEGER DEFAULT 0',
            'ALTER TABLE news ADD COLUMN source_name TEXT DEFAULT "indianexpress"',
            'ALTER TABLE news ADD COLUMN video_url TEXT',
        ]:
            try:
                cursor.execute(col_stmt)
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
        # Core columns that always exist in the Supabase table
        CORE_COLUMNS = {"title", "url", "image", "description", "content", "category", "published_date"}
        # Optional columns that may or may not exist (until added via Dashboard)
        OPTIONAL_COLUMNS = {"slug", "is_live", "source_name", "video_url"}
        
        def strip_to_columns(items, columns):
            """Strip items to only include allowed columns."""
            return [{k: v for k, v in item.items() if k in columns} for item in items]
        
        try:
            # 1. To bypass RLS (Row-Level Security) "UPDATE" restrictions on existing rows, 
            # we first filter out articles already in the database.
            incoming_urls = [n.get("url") for n in news_list if n.get("url")]
            existing_urls = set()
            
            # Fetch existing urls in batches of 100 to avoid long query strings
            for i in range(0, len(incoming_urls), 100):
                batch_urls = incoming_urls[i:i+100]
                existing_res = supabase.table("news").select("url").in_("url", batch_urls).execute()
                if existing_res.data:
                    for row in existing_res.data:
                        existing_urls.add(row["url"])
            
            # Filter for strictly new articles
            new_articles = [n for n in news_list if n.get("url") not in existing_urls]
            
            if not new_articles:
                print(f"Skipping insert: all {len(news_list)} articles already exist in Supabase (avoiding RLS update block).")
                return 0
                
            print(f"Preparing to insert {len(new_articles)} strictly new articles into Supabase...")
                
            # Try with all columns first
            all_columns = CORE_COLUMNS | OPTIONAL_COLUMNS
            cleaned = strip_to_columns(new_articles, all_columns)
            res = supabase.table("news").upsert(cleaned, on_conflict="url").execute()
            inserted = len(res.data) if res.data else 0
            
            # --- Trigger Realtime Notification ---
            # Automatically insert the strictly new articles into the 'notifications' table!
            try:
                notification_data = [{"title": n.get("title"), "url": n.get("url"), "slug": n.get("slug")} for n in new_articles]
                if notification_data:
                    supabase.table("notifications").insert(notification_data).execute()
                    print(f"Pushed {len(notification_data)} new articles to notifications table for Realtime alerts!")
            except Exception as notify_err:
                print(f"Failed to push to notifications table: {notify_err}")
                
        except Exception as e:
            error_msg = str(e)
            print(f"Supabase insert with all columns failed: {error_msg}")
            # Fallback: use only core columns
            try:
                core_only = strip_to_columns(new_articles, CORE_COLUMNS)
                res = supabase.table("news").upsert(core_only, on_conflict="url").execute()
                inserted = len(res.data) if res.data else 0
                print(f"Supabase fallback (core columns only): inserted {inserted}")
            except Exception as e2:
                print(f"Supabase core-only insert also failed: {e2}")
    else:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        for news in news_list:
            try:
                cursor.execute('''
                    INSERT INTO news (source_name, title, slug, url, image, video_url, description, category, is_live, published_date, content)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(url) DO UPDATE SET
                    slug=excluded.slug,
                    description=excluded.description,
                    content=excluded.content,
                    image=excluded.image,
                    video_url=excluded.video_url,
                    is_live=excluded.is_live
                ''', (
                    news.get("source_name", "indianexpress"),
                    news.get("title"),
                    news.get("slug"),
                    news.get("url"),
                    news.get("image"),
                    news.get("video_url"),
                    news.get("description"),
                    news.get("category"),
                    1 if news.get("is_live") else 0,
                    news.get("published_date"),
                    news.get("content"),
                ))
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
