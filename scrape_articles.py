import requests
from bs4 import BeautifulSoup
import json
import os
import time
import random

def scrape_articles(status_file='scraping_status.json', data_dir='data', delay_min=0.5, delay_max=1.5):
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

    with open(status_file, 'r') as f:
        status_data = json.load(f)

    urls_to_scrape = [url for url, info in status_data.items() if not info.get('scraped', False)]
    total = len(urls_to_scrape)
    print(f"Found {total} articles to scrape.")

    count = 0
    for url in urls_to_scrape:
        count += 1
        print(f"[{count}/{total}] Scraping {url}...")

        try:
            response = requests.get(url, timeout=15)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Find the main content
            content_div = soup.find('div', class_='entry-content')

            if not content_div:
                print(f"  Warning: No entry-content found for {url}")
                # Try finding 'main' tag if entry-content is missing
                content_div = soup.find('main')

            if content_div:
                content_html = str(content_div)

                filename = status_data[url]['filename']
                filepath = os.path.join(data_dir, filename)

                # If filename ends with .md but we are saving HTML content, maybe we should change extension or wrap in MD?
                # The previous filenames were .md. I'll keep it .md but content is HTML.
                # This is fine, markdown viewers often render HTML.

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content_html)

                status_data[url]['scraped'] = True
                print(f"  Saved to {filepath}")
            else:
                print(f"  Error: Could not extract content for {url}")

        except Exception as e:
            print(f"  Failed to scrape {url}: {e}")

        # Save status periodically or after every scrape to avoid data loss
        with open(status_file, 'w') as f:
            json.dump(status_data, f, indent=2)

        time.sleep(random.uniform(delay_min, delay_max))

if __name__ == "__main__":
    scrape_articles()
