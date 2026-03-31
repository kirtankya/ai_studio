import subprocess
import json
import os
from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security.api_key import APIKeyHeader
from typing import List, Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager
from .db import get_all_news, get_news_by_category, get_news_by_id, insert_news, delete_news
from .scraper import scrape

# SCRAPER_PATH definition removed as we are using Python module

def scheduled_scrape():
    print("Running scheduled scrape...")
    try:
        articles = scrape()
        inserted = insert_news(articles)
        print(f"Scheduled scrape complete: inserted {inserted} new articles.")
    except Exception as e:
        print("Scheduled scrape failed:", e)

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()
    scheduler.add_job(scheduled_scrape, 'interval', minutes=15)
    scheduler.start()
    print("Scheduler started (runs every 15 minutes)")
    yield
    scheduler.shutdown()
    print("Scheduler shut down")

app = FastAPI(title="News Scraper API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsItem(BaseModel):
    id: int
    title: str
    slug: Optional[str] = None
    url: str
    image: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    is_live: bool = False
    published_date: Optional[str] = None

@app.get("/api/news", response_model=List[NewsItem])
def read_all_news(category: Optional[str] = None, page: int = 1, size: int = 12):
    if category:
        return get_news_by_category(category, page=page, page_size=size)
    return get_all_news(page=page, page_size=size)

@app.get("/api/news/{news_id}", response_model=NewsItem)
def read_news_item(news_id: int):
    news = get_news_by_id(news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News article not found")
    return news

@app.get("/api/news/slug/{slug:path}", response_model=NewsItem)
def read_news_by_slug_api(slug: str):
    from .db import get_news_by_slug
    news = get_news_by_slug(slug)
    if not news:
        raise HTTPException(status_code=404, detail="News article not found")
    return news

@app.get("/api/news/category/{category}", response_model=List[NewsItem])
def read_news_by_category_api(category: str, page: int = 1, size: int = 12):
    return get_news_by_category(category, page=page, page_size=size)

class LoginRequest(BaseModel):
    username: str
    password: str

# Use environment variables for admin credentials and token
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "secure-admin-token")

@app.post("/api/admin/login")
def admin_login(req: LoginRequest):
    if req.username == ADMIN_USERNAME and req.password == ADMIN_PASSWORD:
        return {"token": ADMIN_TOKEN}
    raise HTTPException(status_code=401, detail="Invalid credentials")

api_key_header = APIKeyHeader(name="Authorization", auto_error=True)

def get_admin_user(api_key: str = Security(api_key_header)):
    if api_key != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=403, detail="Not authenticated")
    return True

@app.post("/api/admin/scrape", dependencies=[Depends(get_admin_user)])
def trigger_scrape():
    try:
        articles = scrape()
        inserted = insert_news(articles)
        return {"message": f"Successfully scraped and inserted {inserted} new articles out of {len(articles)} fetched."}
    except Exception as e:
        print("Scrape error:", e)
        raise HTTPException(status_code=500, detail="Failed to run scraper")

@app.delete("/api/admin/news/{news_id}", dependencies=[Depends(get_admin_user)])
def delete_news_item(news_id: int):
    success = delete_news(news_id)
    if not success:
        raise HTTPException(status_code=404, detail="News not found or could not be deleted")
    return {"message": "News deleted successfully"}
