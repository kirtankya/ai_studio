"""
Cron job entry point - used by GitHub Actions workflow.
Runs the Divya Bhaskar scraper and inserts results into Supabase.
Exits with non-zero code on failure so GitHub Actions reports it correctly.
"""
import sys
import os

# Force UTF-8 output for GitHub Actions runner
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    # 1. Verify Supabase connection
    from db import USE_SUPABASE
    if not USE_SUPABASE:
        print("FATAL: Cannot connect to Supabase. Check SUPABASE_URL and SUPABASE_KEY.")
        sys.exit(1)

    print("Supabase connection: OK")

    # 2. Run scraper
    from divyabhaskar_scraper import scrape
    from db import insert_news

    articles = scrape()
    print(f"Scraped {len(articles)} articles")

    if not articles:
        print("WARNING: No articles scraped - RSS feeds may be down")
        sys.exit(1)

    # 3. Insert into database
    try:
        inserted = insert_news(articles)
        print(f"Inserted {inserted} new articles into Supabase")

        if inserted == 0:
            print("INFO: No new articles to insert (all already exist)")
        else:
            print(f"SUCCESS: {inserted} new articles added")
    except Exception as e:
        print(f"FATAL: Database insert failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
