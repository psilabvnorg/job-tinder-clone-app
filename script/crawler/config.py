"""Crawler configuration and constants"""

JSON_FILE = 'jobs_output.json'
DB_FILE = '../public/data/jobs.db'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
}

DEFAULT_BACKGROUNDS = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
]

CATEGORY_KEYWORDS = {
    'Nhân viên kinh doanh': ['kinh doanh', 'sales', 'bán hàng', 'sale'],
    'Kế toán': ['kế toán', 'ke toan', 'accounting', 'accountant'],
    'Marketing': ['marketing', 'digital marketing', 'content', 'seo', 'quảng cáo'],
    'Hành chính nhân sự': ['nhân sự', 'hành chính', 'hr', 'admin', 'tuyển dụng'],
    'Chăm sóc khách hàng': ['chăm sóc khách hàng', 'cskh', 'customer service', 'hỗ trợ khách'],
    'Ngân hàng': ['ngân hàng', 'bank', 'tín dụng', 'cho vay'],
    'IT': ['it', 'developer', 'lập trình', 'software', 'engineer', 'devops', 'frontend', 'backend'],
    'Lao động phổ thông': ['lao động phổ thông', 'công nhân', 'thợ', 'bốc xếp'],
    'Senior': ['senior', 'trưởng phòng', 'quản lý', 'manager', 'lead', 'director'],
    'Kỹ sư xây dựng': ['xây dựng', 'construction', 'kỹ sư', 'kiến trúc', 'civil'],
    'Thiết kế đồ hoạ': ['thiết kế', 'design', 'đồ hoạ', 'graphic', 'ui', 'ux'],
    'Bất động sản': ['bất động sản', 'real estate', 'bds', 'môi giới'],
    'Giáo dục': ['giáo dục', 'giáo viên', 'teacher', 'education', 'đào tạo', 'giảng viên'],
    'Telesales': ['telesales', 'telemarketing', 'tele', 'gọi điện'],
}
