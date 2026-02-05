"""HTML parsing functions"""
import hashlib
import random
from datetime import datetime

import requests
from bs4 import BeautifulSoup

from .config import HEADERS, DEFAULT_BACKGROUNDS, CATEGORY_KEYWORDS


def fetch_page(url: str) -> str | None:
    """Fetch HTML content from URL"""
    try:
        print(f"  [FETCH] {url}")
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"  [ERROR] {e}")
        return None


def parse_job_list(html: str) -> list[dict]:
    """Parse job list page and extract basic job info"""
    soup = BeautifulSoup(html, 'html.parser')
    jobs = []
    cards = soup.select('div.job-item-search-result')
    
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


def detect_category(title: str, description: str) -> str:
    """Auto-detect job category based on title and description"""
    text = (title + ' ' + description).lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword.lower() in text:
                return category
    return 'Khác'


def parse_job_detail(html: str, url: str) -> dict | None:
    """Parse job detail page and extract full job info"""
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
        title_text = title.get_text(strip=True) if title else ''
        
        return {
            'id': hashlib.md5(url.encode()).hexdigest()[:12],
            'title': title_text,
            'company': company.get_text(strip=True) if company else '',
            'salary': salary.get_text(strip=True) if salary else 'Thoa thuan',
            'location': location.get_text(strip=True) if location else '',
            'experience': experience.get_text(strip=True) if experience else '',
            'category': detect_category(title_text, description),
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
        print(f"  [ERROR] Parse failed: {e}")
        return None
