"""
Crawl all categories from config-craw.json

Usage:
  python craw-all.py 10    # Crawl 10 jobs per category
  python craw-all.py 20    # Crawl 20 jobs per category
  python craw-all.py 30    # Crawl 30 jobs per category
"""
import json
import sys

from crawler import crawl_jobs, save_jobs_to_db, JSON_FILE

CONFIG_FILE = 'config-craw.json'


def main():
    max_jobs = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    
    # Load config
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    categories = config.get('categories', [])
    print(f"\n{'='*60}")
    print(f"CRAWL ALL - {max_jobs} jobs per category")
    print(f"{'='*60}")
    print(f"Categories: {len(categories)}\n")
    
    all_jobs = []
    
    # Loop through categories and call crawl_jobs
    for i, cat in enumerate(categories):
        name = cat.get('name', 'Unknown')
        url = cat.get('url', '')
        
        print(f"[{i+1}/{len(categories)}] {name}")
        
        if not url:
            print("  [SKIP] No URL")
            continue
        
        jobs = crawl_jobs(url, max_jobs)
        all_jobs.extend(jobs)
        print(f"  [OK] {len(jobs)} jobs\n")
    
    # Save all to JSON
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_jobs, f, ensure_ascii=False, indent=2)
    print(f"[JSON] Saved {len(all_jobs)} jobs to {JSON_FILE}")
    
    # Save to database
    inserted = save_jobs_to_db(all_jobs)
    print(f"[DB] Inserted {inserted} jobs")
    
    print(f"\n{'='*60}")
    print(f"DONE: {len(all_jobs)} total jobs")
    print(f"{'='*60}\n")


if __name__ == '__main__':
    main()
