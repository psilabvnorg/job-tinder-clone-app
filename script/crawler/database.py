"""Database operations"""
import json
import sqlite3
from datetime import datetime

from .config import DB_FILE


def save_jobs_to_db(jobs: list[dict], db_file: str = DB_FILE) -> int:
    """Save jobs to SQLite database. Returns number of inserted jobs."""
    conn = sqlite3.connect(db_file)
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT,
            salary TEXT,
            job_type TEXT,
            category TEXT,
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
    
    # Migration: add category column if not exists
    try:
        conn.execute('ALTER TABLE jobs ADD COLUMN category TEXT')
    except:
        pass
    
    inserted = 0
    for job in jobs:
        try:
            conn.execute('''
                INSERT OR REPLACE INTO jobs 
                (id, title, company, location, salary, job_type, category, remote, description, 
                 requirements, url, source, background_image, created_at, raw_data, crawled_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                job.get('id'),
                job.get('title'),
                job.get('company'),
                job.get('location'),
                job.get('salary'),
                job.get('experience', 'Full-time'),
                job.get('category', 'Khác'),
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
        except Exception as e:
            print(f"  [DB ERROR] {e}")
    
    conn.commit()
    conn.close()
    return inserted
