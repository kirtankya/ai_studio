"""
Cron job entry point - used by GitHub Actions workflow.
Runs the Divya Bhaskar scraper and inserts results into Supabase.
"""
import sys
import os

# Force UTF-8 output for GitHub Actions runner
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    # 1. Read env vars directly (GitHub Actions injects them via secrets)
    url = os.environ.get("SUPABASE_URL", "").strip()
    key = os.environ.get("SUPABASE_KEY", "").strip()

    if not url or not key:
        print("FATAL: SUPABASE_URL or SUPABASE_KEY is missing.")
        print("Go to GitHub repo → Settings → Secrets and variables → Actions")
        print("and add SUPABASE_URL and SUPABASE_KEY as repository secrets.")
        sys.exit(1)

    print("Supabase env vars: OK")

    # 2. Connect to Supabase
    try:
        from supabase import create_client
        supabase = create_client(url, key)
        # Quick connectivity check
        supabase.table("news").select("id").limit(1).execute()
        print("Supabase connection: OK")
    except Exception as e:
        print(f"FATAL: Supabase connection failed: {e}")
        sys.exit(1)

    # 3. Run scraper
    from divyabhaskar_scraper import scrape
    articles = scrape()
    print(f"Scraped {len(articles)} articles")

    if not articles:
        print("WARNING: No articles scraped - RSS feeds may be down")
        sys.exit(0)  # Don't fail the job when feeds are temporarily down

    # 4. Insert into database
    try:
        from db import insert_news
        inserted = insert_news(articles)
        print(f"Inserted {inserted} new articles into Supabase")
        print(f"SUCCESS: Done. {inserted} new, {len(articles)} total scraped.")

        # 5. Cleanup old notifications (older than 2 days)
        try:
            from datetime import datetime, timezone, timedelta
            two_days_ago = (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
            supabase.table("notifications").delete().lt("created_at", two_days_ago).execute()
            print("Cleanup: Deleted old notifications (> 2 days old) successfully.")
        except Exception as e:
            print(f"WARNING: Cleanup of old notifications failed: {e}")

    except Exception as e:
        print(f"FATAL: Database insert failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
