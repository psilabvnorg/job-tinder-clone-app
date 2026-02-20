"""
python insert_mock_data.py --truncate  
---
Insert mock data (instructors, stories, posts, companies, practice_questions) into SQLite

Usage:
  python insert_mock_data.py                           # Use default JSON, no truncate
  python insert_mock_data.py <json_file>               # Use custom JSON file
  python insert_mock_data.py --truncate                # Truncate tables before insert
  python insert_mock_data.py <json_file> --truncate    # Custom JSON + truncate

Examples:
  python insert_mock_data.py
  python insert_mock_data.py my_generated_data.json
  python insert_mock_data.py --truncate
  python insert_mock_data.py my_generated_data.json --truncate
"""
import argparse
import json
import sqlite3
import sys
from datetime import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
DEFAULT_JSON = SCRIPT_DIR / "mock_data_template.json"
DB_FILE = SCRIPT_DIR.parent / "public" / "data" / "jobs.db"

TABLES_TO_TRUNCATE = ['instructors', 'stories', 'companies', 'posts', 'practice_questions']


def truncate_tables(conn):
    """Delete all data from tables"""
    print("[DB] Truncating tables...")
    for table in TABLES_TO_TRUNCATE:
        try:
            conn.execute(f'DELETE FROM {table}')
            print(f"  - Truncated: {table}")
        except Exception as e:
            print(f"  - Skip {table}: {e}")
    conn.commit()


def create_tables(conn):
    """Create all required tables"""
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS instructors (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            username TEXT UNIQUE,
            avatar TEXT,
            category TEXT,
            verified INTEGER DEFAULT 0,
            created_at TEXT
        )
    ''')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS stories (
            id INTEGER PRIMARY KEY,
            user_name TEXT,
            user_username TEXT,
            image TEXT,
            has_unseen INTEGER DEFAULT 1,
            created_at TEXT
        )
    ''')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS companies (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            logo TEXT,
            industry TEXT,
            size TEXT,
            location TEXT,
            created_at TEXT
        )
    ''')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY,
            author_id INTEGER,
            time TEXT,
            content TEXT,
            image TEXT,
            tags TEXT,
            likes INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0,
            category TEXT,
            quiz_question TEXT,
            quiz_options TEXT,
            quiz_correct_id TEXT,
            quiz_explanation TEXT,
            created_at TEXT,
            FOREIGN KEY (author_id) REFERENCES instructors(id)
        )
    ''')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS practice_questions (
            id TEXT PRIMARY KEY,
            topic TEXT,
            title TEXT,
            question TEXT,
            options TEXT,
            correct_option_id TEXT,
            explanation TEXT,
            image TEXT,
            created_at TEXT
        )
    ''')
    
    conn.commit()
    print("[DB] Tables created/verified")


def insert_instructors(conn, instructors):
    count = 0
    for item in instructors:
        try:
            conn.execute('''
                INSERT OR REPLACE INTO instructors 
                (id, name, username, avatar, category, verified, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                item['id'],
                item['name'],
                item['username'],
                item.get('avatar'),
                item.get('category'),
                1 if item.get('verified') else 0,
                datetime.now().isoformat()
            ))
            count += 1
        except Exception as e:
            print(f"  [ERROR] instructor: {e}")
    return count


def insert_stories(conn, stories):
    count = 0
    for item in stories:
        try:
            conn.execute('''
                INSERT OR REPLACE INTO stories 
                (id, user_name, user_username, image, has_unseen, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                item['id'],
                item.get('user_name'),
                item.get('user_username'),
                item.get('image'),
                1 if item.get('has_unseen', True) else 0,
                datetime.now().isoformat()
            ))
            count += 1
        except Exception as e:
            print(f"  [ERROR] story: {e}")
    return count


def insert_companies(conn, companies):
    count = 0
    for item in companies:
        try:
            conn.execute('''
                INSERT OR REPLACE INTO companies 
                (id, name, logo, industry, size, location, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                item['id'],
                item['name'],
                item.get('logo'),
                item.get('industry'),
                item.get('size'),
                item.get('location'),
                datetime.now().isoformat()
            ))
            count += 1
        except Exception as e:
            print(f"  [ERROR] company: {e}")
    return count


def insert_posts(conn, posts):
    count = 0
    for item in posts:
        try:
            conn.execute('''
                INSERT OR REPLACE INTO posts 
                (id, author_id, time, content, image, tags, likes, comments, 
                 category, quiz_question, quiz_options, quiz_correct_id, quiz_explanation, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                item['id'],
                item.get('author_id'),
                item.get('time'),
                item.get('content'),
                item.get('image'),
                json.dumps(item.get('tags', []), ensure_ascii=False),
                item.get('likes', 0),
                item.get('comments', 0),
                item.get('category'),
                item.get('quiz_question'),
                json.dumps(item.get('quiz_options', []), ensure_ascii=False),
                item.get('quiz_correct_id'),
                item.get('quiz_explanation'),
                datetime.now().isoformat()
            ))
            count += 1
        except Exception as e:
            print(f"  [ERROR] post: {e}")
    return count


def insert_practice_questions(conn, questions):
    count = 0
    for item in questions:
        try:
            conn.execute('''
                INSERT OR REPLACE INTO practice_questions 
                (id, topic, title, question, options, correct_option_id, explanation, image, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                item['id'],
                item.get('topic'),
                item.get('title'),
                item.get('question'),
                json.dumps(item.get('options', []), ensure_ascii=False),
                item.get('correct_option_id'),
                item.get('explanation'),
                item.get('image'),
                datetime.now().isoformat()
            ))
            count += 1
        except Exception as e:
            print(f"  [ERROR] practice_question: {e}")
    return count


def main():
    parser = argparse.ArgumentParser(description='Insert mock data into SQLite database')
    parser.add_argument('json_file', nargs='?', default=None, help='JSON file with mock data')
    parser.add_argument('--truncate', '-t', action='store_true', help='Truncate tables before inserting')
    args = parser.parse_args()
    
    json_file = Path(args.json_file) if args.json_file else DEFAULT_JSON
    
    if not json_file.exists():
        print(f"[ERROR] File not found: {json_file}")
        sys.exit(1)
    
    print(f"[LOAD] Reading {json_file}...")
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"[DB] Connecting to {DB_FILE}...")
    conn = sqlite3.connect(DB_FILE)
    
    create_tables(conn)
    
    if args.truncate:
        truncate_tables(conn)
    
    results = {}
    
    if 'instructors' in data:
        results['instructors'] = insert_instructors(conn, data['instructors'])
    
    if 'stories' in data:
        results['stories'] = insert_stories(conn, data['stories'])
    
    if 'companies' in data:
        results['companies'] = insert_companies(conn, data['companies'])
    
    if 'posts' in data:
        results['posts'] = insert_posts(conn, data['posts'])
    
    if 'practice_questions' in data:
        results['practice_questions'] = insert_practice_questions(conn, data['practice_questions'])
    
    conn.commit()
    conn.close()
    
    print("\n[DONE] Inserted:")
    for table, count in results.items():
        print(f"  - {table}: {count}")


if __name__ == '__main__':
    main()
