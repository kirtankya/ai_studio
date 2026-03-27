import os
import sqlite3
from typing import List, Dict, Any
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

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
                url TEXT UNIQUE NOT NULL,
                image TEXT,
                description TEXT,
                category TEXT,
                published_date TEXT
            )
        ''')
        conn.commit()
        conn.close()

init_db()

def insert_news(news_list: List[Dict[str, Any]]):
    inserted = 0
    if USE_SUPABASE:
        for news in news_list:
            # Check for duplicate
            res = supabase.table("news").select("id").eq("url", news["url"]).execute()
            if not res.data:
                supabase.table("news").insert(news).execute()
                inserted += 1
    else:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        for news in news_list:
            try:
                cursor.execute('''
                    INSERT INTO news (title, url, image, description, category, published_date)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (news.get("title"), news.get("url"), news.get("image"), news.get("description"), news.get("category"), news.get("published_date")))
                inserted += 1
            except sqlite3.IntegrityError:
                pass # Duplicate URL
        conn.commit()
        conn.close()
    return inserted

def get_all_news() -> List[Dict[str, Any]]:
    if USE_SUPABASE:
        res = supabase.table("news").select("*").order("id", desc=True).execute()
        return res.data
    else:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM news ORDER BY id DESC')
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

def get_news_by_category(category: str) -> List[Dict[str, Any]]:
    if USE_SUPABASE:
        res = supabase.table("news").select("*").eq("category", category).order("id", desc=True).execute()
        return res.data
    else:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM news WHERE category = ? ORDER BY id DESC', (category,))
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
