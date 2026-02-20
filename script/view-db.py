"""
View first 2 rows of all tables in SQLite database

Usage: python view-db.py
"""
import sqlite3

DB_FILE = '../public/data/jobs.db'

def view_database():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    if not tables:
        print("[INFO] No tables found in database")
        conn.close()
        return
    
    for (table_name,) in tables:
        print("\n" + "=" * 60)
        print(f"TABLE: {table_name}")
        print("=" * 60)
        
        # Get column names
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = [col[1] for col in cursor.fetchall()]
        print(f"Columns: {', '.join(columns)}\n")
        
        # Get first 5 rows
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 2")
        rows = cursor.fetchall()
        
        if not rows:
            print("[No data]")
            continue
        
        for i, row in enumerate(rows, 1):
            print(f"--- Row {i} ---")
            for col, val in zip(columns, row):
                # Truncate long values
                val_str = str(val) if val else 'NULL'
                if len(val_str) > 80:
                    val_str = val_str[:80] + '...'
                print(f"  {col}: {val_str}")
            print()
    
    conn.close()


if __name__ == '__main__':
    view_database()
