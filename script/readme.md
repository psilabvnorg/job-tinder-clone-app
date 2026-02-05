# Crawl single URL
python craw-job.py https://www.topcv.vn/tim-viec-lam-ke-toan 10

# Crawl all categories
python craw-all.py 10    # 10 jobs per category
python craw-all.py 20    # 20 jobs per category
python craw-all.py 30    # 30 jobs per category

# JSON to DB only
python craw-job.py step2