import json
import os
import re

def compare_status_to_data():
    # Load scraping status
    with open('scraping_status.json', 'r') as f:
        status = json.load(f)

    articles_dir = 'data/dict/articles'
    existing_articles = set(os.listdir(articles_dir))

    missing_data = []
    incomplete_data = []

    # Check status -> data
    for url, data in status.items():
        if data.get('scraped') is True:
            slug = data.get('slug')
            match = re.match(r'^\d{4}-\d{2}-\d{2}-(.+)$', slug)
            if match:
                dir_name = match.group(1)
            else:
                dir_name = slug

            article_path = os.path.join(articles_dir, dir_name)

            if not os.path.isdir(article_path):
                missing_data.append({
                    'url': url,
                    'slug': slug,
                    'expected_dir': dir_name,
                    'reason': 'Directory missing'
                })
            else:
                content_file = os.path.join(article_path, 'content.md')
                index_file = os.path.join(article_path, 'index.yaml')

                if not os.path.isfile(content_file):
                    incomplete_data.append({
                        'url': url,
                        'slug': slug,
                        'expected_dir': dir_name,
                        'reason': 'content.md missing'
                    })
                elif os.path.getsize(content_file) < 10:
                    incomplete_data.append({
                        'url': url,
                        'slug': slug,
                        'expected_dir': dir_name,
                        'reason': 'content.md empty or too short'
                    })

                if not os.path.isfile(index_file):
                    incomplete_data.append({
                        'url': url,
                        'slug': slug,
                        'expected_dir': dir_name,
                        'reason': 'index.yaml missing'
                    })

    # Check data -> status
    unexpected_data = []

    # Map expected directory names to data + url
    expected_dirs = {}
    for url, data in status.items():
        slug = data.get('slug')
        match = re.match(r'^\d{4}-\d{2}-\d{2}-(.+)$', slug)
        if match:
            dir_name = match.group(1)
        else:
            dir_name = slug

        data['url'] = url
        expected_dirs[dir_name] = data

    for dir_name in existing_articles:
        if dir_name not in expected_dirs:
            unexpected_data.append({
                'dir': dir_name,
                'reason': 'Not in status JSON'
            })
        elif expected_dirs[dir_name].get('scraped') is False:
            unexpected_data.append({
                'dir': dir_name,
                'reason': 'Marked as scraped: false in JSON',
                'url': expected_dirs[dir_name].get('url')
            })

    # Output report
    if missing_data:
        print(f"\n[MISSING DATA] Found {len(missing_data)} entries marked as scraped: true but missing from data:")
        for item in missing_data:
            print(f"- URL: {item['url']}")
            print(f"  Slug: {item['slug']}")
            print(f"  Expected Dir: {item['expected_dir']}")
            print(f"  Reason: {item['reason']}")
    else:
        print("\n[OK] No missing data for scraped: true entries.")

    if incomplete_data:
        print(f"\n[INCOMPLETE DATA] Found {len(incomplete_data)} entries marked as scraped: true but with incomplete data:")
        for item in incomplete_data:
            print(f"- URL: {item['url']}")
            print(f"  Slug: {item['slug']}")
            print(f"  Expected Dir: {item['expected_dir']}")
            print(f"  Reason: {item['reason']}")
    else:
        print("\n[OK] No incomplete data for scraped: true entries.")

    if unexpected_data:
        print(f"\n[UNEXPECTED DATA] Found {len(unexpected_data)} directories in data that are not consistent with status:")
        for item in unexpected_data:
            print(f"- Dir: {item['dir']}")
            print(f"  Reason: {item['reason']}")
            if 'url' in item:
                print(f"  URL: {item['url']}")
    else:
        print("\n[OK] All data directories correspond to scraped: true entries.")

if __name__ == '__main__':
    compare_status_to_data()
