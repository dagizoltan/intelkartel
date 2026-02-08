import xml.etree.ElementTree as ET
import json
import os

def parse_sitemap(sitemap_path):
    tree = ET.parse(sitemap_path)
    root = tree.getroot()

    # Namespaces are often used in sitemaps
    namespaces = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

    urls = []
    for url in root.findall('sitemap:url', namespaces):
        loc = url.find('sitemap:loc', namespaces).text
        urls.append(loc)
    return urls

def main():
    sitemap_path = 'sitemap_new.xml'
    if not os.path.exists(sitemap_path):
        print(f"Error: {sitemap_path} not found.")
        return

    urls = parse_sitemap(sitemap_path)

    # Filter out homepage
    homepage = 'https://intelkartel.com/'
    homepage_no_slash = 'https://intelkartel.com'

    articles = [url for url in urls if url != homepage and url != homepage_no_slash]

    print(f"Found {len(articles)} articles.")

    # Save to file
    with open('articles_list.txt', 'w') as f:
        for article in articles:
            f.write(article + '\n')

    # Also update scraping_status.json if it exists
    status_file = 'scraping_status.json'
    current_status = {}
    if os.path.exists(status_file):
        with open(status_file, 'r') as f:
            current_status = json.load(f)

    new_articles_count = 0
    for url in articles:
        if url not in current_status:
            # Create a slug from the URL
            slug = url.strip('/').split('/')[-1]
            if not slug: # Handle cases like .../2026/02/06/
                 slug = "-".join(url.strip('/').split('/')[-4:])

            current_status[url] = {
                "slug": slug,
                "filename": f"{slug}.md", # assuming we will save as md
                "scraped": False
            }
            new_articles_count += 1

    print(f"Added {new_articles_count} new articles to status tracking.")

    with open(status_file, 'w') as f:
        json.dump(current_status, f, indent=2)

if __name__ == "__main__":
    main()
