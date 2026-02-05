# Job Crawler & SQLite Integration

## Usage

### Crawl jobs (50, 100, or 200)
```bash
# From project root
npm run crawl:50   # Crawl 50 jobs
npm run crawl:100  # Crawl 100 jobs  
npm run crawl:200  # Crawl 200 jobs

# Or directly
cd script
python craw-job.py -m 50   # 50 jobs
python craw-job.py -m 100  # 100 jobs
python craw-job.py -m 200  # 200 jobs
```

### How it works
1. Script crawls jobs → saves to `script/jobs.db`
2. Script copies `jobs.db` → `public/jobs.db`
3. React app loads SQLite via sql.js (WebAssembly)
4. App works offline with local database

### Data flow
```
craw-job.py → jobs.db → public/jobs.db → React (sql.js) → Offline app
```
