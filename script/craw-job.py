"""
TopCV Job Crawler

Usage:
  python craw-job.py step1 5        # Step 1: Crawl 5 jobs -> jobs_output.json
  python craw-job.py step2          # Step 2: JSON -> SQLite (jobs.db)
  python craw-job.py all 5          # Run both steps
"""
import json
import hashlib
import random
import sqlite3
import time
import sys
from datetime import datetime

import requests
from bs4 import BeautifulSoup

# Config
JSON_FILE = 'jobs_output.json'
DB_FILE = '../public/data/jobs.db'

DEFAULT_BACKGROUNDS = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
}


# ============================================================
# CRAWL FUNCTIONS
# ============================================================

def fetch_page(url: str) -> str | None:
    try:
        print(f"[FETCH] {url}")
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"[ERROR] {e}")
        return None


def parse_job_list(html: str) -> list[dict]:
    soup = BeautifulSoup(html, 'html.parser')
    jobs = []
    cards = soup.select('div.job-item-search-result')
    print(f"[PARSE] Found {len(cards)} job cards")
    
    for card in cards:
        try:
            title_link = card.select_one('h3.title a')
            if not title_link:
                continue
            
            company_elem = card.select_one('a.company span.company-name')
            salary_elem = card.select_one('label.title-salary') or card.select_one('label.salary span')
            loc_elem = card.select_one('label.address span.city-text')
            
            jobs.append({
                'job_id': card.get('data-job-id', ''),
                'title': title_link.get_text(strip=True),
                'url': title_link.get('href', ''),
                'company': company_elem.get_text(strip=True) if company_elem else '',
                'salary': salary_elem.get_text(strip=True) if salary_elem else 'Thoa thuan',
                'location': loc_elem.get_text(strip=True) if loc_elem else '',
            })
        except:
            continue
    return jobs


def parse_job_detail(html: str, url: str) -> dict | None:
    soup = BeautifulSoup(html, 'html.parser')
    
    try:
        title = soup.select_one('h1.job-detail__info--title')
        company = soup.select_one('div.company-name-label a.name')
        salary = soup.select_one('div.section-salary .job-detail__info--section-content-value')
        location = soup.select_one('div.section-location .job-detail__info--section-content-value')
        experience = soup.select_one('div.section-experience .job-detail__info--section-content-value')
        
        description = requirements = benefits = ''
        for item in soup.select('div.job-description__item'):
            h3 = item.select_one('h3')
            content = item.select_one('.job-description__item--content')
            if not h3 or not content:
                continue
            heading = h3.get_text(strip=True).lower()
            text = content.get_text(strip=True)
            if 'mo ta' in heading or 'mô tả' in heading:
                description = text
            elif 'yeu cau' in heading or 'yêu cầu' in heading:
                requirements = text
            elif 'quyen loi' in heading or 'quyền lợi' in heading:
                benefits = text
        
        tags = [t.get_text(strip=True) for t in soup.select('.item-tag')[:6]]
        logo = soup.select_one('.company-logo img')
        page_text = soup.get_text().lower()
        
        return {
            'id': hashlib.md5(url.encode()).hexdigest()[:12],
            'title': title.get_text(strip=True) if title else '',
            'company': company.get_text(strip=True) if company else '',
            'salary': salary.get_text(strip=True) if salary else 'Thoa thuan',
            'location': location.get_text(strip=True) if location else '',
            'experience': experience.get_text(strip=True) if experience else '',
            'description': description[:500],
            'requirements': requirements[:500],
            'benefits': benefits[:500],
            'tags': tags,
            'logo': logo.get('src', '') if logo else '',
            'remote': any(kw in page_text for kw in ['remote', 'lam viec tu xa', 'wfh']),
            'url': url,
            'background_image': random.choice(DEFAULT_BACKGROUNDS),
            'source': 'topcv',
            'created_at': datetime.now().isoformat(),
        }
    except Exception as e:
        print(f"[ERROR] Parse failed: {e}")
        return None


# ============================================================
# STEP 1: CRAWL -> JSON
# ============================================================

def step1_crawl_to_json(max_jobs: int = 5):
    print("\n" + "=" * 50)
    print(f"STEP 1: Crawl {max_jobs} jobs -> {JSON_FILE}")
    print("=" * 50)
    
    html = fetch_page("https://www.topcv.vn/tim-viec-lam-nhan-vien-kinh-doanh")
    if not html:
        print("[FAIL] Cannot fetch job list")
        return False
    
    jobs_list = parse_job_list(html)[:max_jobs]
    print(f"[INFO] Crawling {len(jobs_list)} jobs...")
    
    results = []
    for i, job in enumerate(jobs_list):
        print(f"[{i+1}/{len(jobs_list)}] {job['title'][:40]}...")
        detail_html = fetch_page(job['url'])
        if detail_html:
            job_data = parse_job_detail(detail_html, job['url'])
            if job_data:
                results.append(job_data)
        time.sleep(1)
    
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n[DONE] Saved {len(results)} jobs to {JSON_FILE}")
    return True


# ============================================================
# STEP 2: JSON -> SQLITE
# ============================================================

def step2_json_to_db():
    print("\n" + "=" * 50)
    print(f"STEP 2: {JSON_FILE} -> {DB_FILE}")
    print("=" * 50)
    
    # Load JSON
    try:
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            jobs = json.load(f)
        print(f"[LOAD] {len(jobs)} jobs from {JSON_FILE}")
    except FileNotFoundError:
        print(f"[ERROR] {JSON_FILE} not found. Run step1 first!")
        return False
    
    # Init DB
    conn = sqlite3.connect(DB_FILE)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT,
            salary TEXT,
            job_type TEXT,
            remote INTEGER DEFAULT 0,
            description TEXT,
            requirements TEXT,
            url TEXT UNIQUE,
            source TEXT,
            background_image TEXT,
            created_at TEXT,
            raw_data TEXT,
            crawled_at TEXT
        )
    ''')
    
    # Insert jobs
    inserted = 0
    for job in jobs:
        try:
            conn.execute('''
                INSERT OR REPLACE INTO jobs 
                (id, title, company, location, salary, job_type, remote, description, 
                 requirements, url, source, background_image, created_at, raw_data, crawled_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                job.get('id'),
                job.get('title'),
                job.get('company'),
                job.get('location'),
                job.get('salary'),
                job.get('experience', 'Full-time'),
                1 if job.get('remote') else 0,
                job.get('description'),
                ','.join(job.get('tags', [])),
                job.get('url'),
                job.get('source', 'topcv'),
                job.get('background_image'),
                job.get('created_at'),
                json.dumps(job, ensure_ascii=False),
                datetime.now().isoformat()
            ))
            inserted += 1
            print(f"[DB] {job.get('title')[:40]}...")
        except Exception as e:
            print(f"[ERROR] {e}")
    
    conn.commit()
    conn.close()
    print(f"\n[DONE] Inserted {inserted} jobs to {DB_FILE}")
    return True


# ============================================================
# MAIN
# ============================================================

def print_usage():
    print("""
Usage:
  python craw-job.py step1 5    # Crawl 5 jobs -> jobs_output.json
  python craw-job.py step2      # JSON -> SQLite (jobs.db)
  python craw-job.py all 5      # Run both steps
""")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print_usage()
        sys.exit(1)
    
    cmd = sys.argv[1].lower()
    max_jobs = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    
    if cmd == 'step1':
        step1_crawl_to_json(max_jobs)
    elif cmd == 'step2':
        step2_json_to_db()
    elif cmd == 'all':
        if step1_crawl_to_json(max_jobs):
            step2_json_to_db()
    else:
        print_usage()
