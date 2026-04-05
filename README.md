# AI Studio - News Aggregation Platform

This is a comprehensive news aggregation application featuring an automated scraper backend and a Next.js frontend, utilizing Supabase for data storage.

## Project Structure

- **`/frontend`**: A Next.js (App Router) web interface displaying categorized news articles. It is designed for optimal SEO, supporting dynamic sitemaps, semantic HTML, and custom metadata for each news article category.
- **`/backend`**: Contains python scripts (e.g. `cron_runner.py`, `db.py`) handling the data extraction logic. The platform utilizes cron jobs and GitHub actions to scrape RSS feeds from various news outlets (like Divya Bhaskar, NDTV) periodically.

## Technology Stack

### Frontend
- **Framework**: Next.js 14
- **Styling**: SCSS/Sass
- **Database Client**: `@supabase/supabase-js`

### Backend
- **Language**: Python
- **Automated Tasks**: Cron Jobs (via GitHub Actions)
- **Database**: Supabase (PostgreSQL) / Local SQLite (Environment aware)

## Setup and Installation

### 1. Clone the repository
```bash
git clone <repository_url>
cd ai_studio
```

### 2. Frontend Setup
Navigate into the frontend directory:
```bash
cd frontend
npm install
```
Configure your environment variables by creating a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Run the development server:
```bash
npm run dev
```

### 3. Backend Setup
Navigate into the backend directory:
```bash
cd backend
python -m venv .venv
# Activate the virtual environment
# Windows: .venv\Scripts\activate
# Unix: source .venv/bin/activate
pip install -r requirements.txt
```
Run the scraper manually:
```bash
python cron_runner.py
```

## Features
- **Automated News Scraping**: Real-time extraction of live news feeds using Python schedulers and GitHub Actions.
- **Robust Database Logic**: Environment-based conditional storage falling back to SQLite locally or migrating seamlessly to Supabase.
- **SEO Optimized Frontend**: Complete with auto-generating dynamic `sitemap.xml`, appropriate canonical URLs, and dynamic metadata configuration.
