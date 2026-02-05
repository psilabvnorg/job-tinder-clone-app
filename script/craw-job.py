"""
TopCV Job Crawler

Usage:
  python craw-job.py <url> <max_jobs>   # Crawl jobs from URL
  python craw-job.py step2              # JSON -> SQLite (jobs.db)

Examples:
  python craw-job.py https://www.topcv.vn/tim-viec-lam-ke-toan 10
  python craw-job.py step2
"""
import json
import sys

from crawler import crawl_jobs, save_jobs_to_db, JSON_FILE


def crawl_to_json(url: str, max_jobs: int) -> list[dict]:
    """Crawl jobs from URL and save to JSON"""
    print(f"\n[CRAWL] {url} (max: {max_jobs})")
    
    jobs = crawl_jobs(url, max_jobs)
    
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)
    
    print(f"[DONE] Saved {len(jobs)} jobs to {JSON_FILE}")
    return jobs


def json_to_db():
    """Load JSON and save to database"""
    print(f"\n[DB] Loading {JSON_FILE}...")
    
    try:
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            jobs = json.load(f)
    except FileNotFoundError:
        print(f"[ERROR] {JSON_FILE} not found!")
        return
    
    inserted = save_jobs_to_db(jobs)
    print(f"[DONE] Inserted {inserted} jobs to database")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    if sys.argv[1].lower() == 'step2':
        json_to_db()
    else:
        url = sys.argv[1]
        max_jobs = int(sys.argv[2]) if len(sys.argv) > 2 else 10
        crawl_to_json(url, max_jobs)
