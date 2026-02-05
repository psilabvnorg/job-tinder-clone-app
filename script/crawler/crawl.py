"""Core crawling logic"""
import time

from .parser import fetch_page, parse_job_list, parse_job_detail


def crawl_jobs(url: str, max_jobs: int = 10) -> list[dict]:
    """
    Crawl jobs from a category URL.
    Returns list of job dictionaries.
    """
    html = fetch_page(url)
    if not html:
        return []
    
    jobs_list = parse_job_list(html)[:max_jobs]
    print(f"  [INFO] Found {len(jobs_list)} jobs, crawling details...")
    
    results = []
    for i, job in enumerate(jobs_list):
        print(f"    [{i+1}/{len(jobs_list)}] {job['title'][:40]}...")
        detail_html = fetch_page(job['url'])
        if detail_html:
            job_data = parse_job_detail(detail_html, job['url'])
            if job_data:
                results.append(job_data)
        time.sleep(1)  # Rate limiting
    
    return results
