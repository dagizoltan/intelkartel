import os
import json
import re
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
import html2text
import requests
import time

# Constants
LEGACY_DIR = Path("legacy")
ASSETS_DIR = Path("assets")
IMAGES_DIR_LEGACY = LEGACY_DIR / "images"
STATUS_FILE = Path("scraping_status.json")
SITEMAP_FILE = Path("sitemap.xml")

def migrate_existing_content():
    """Migrates existing content from legacy/ to assets/ structure."""
    if not ASSETS_DIR.exists():
        ASSETS_DIR.mkdir()

    if not STATUS_FILE.exists():
        print(f"Error: {STATUS_FILE} not found.")
        return

    with open(STATUS_FILE, "r") as f:
        status_data = json.load(f)

    for url, data in status_data.items():
        if not data.get("scraped"):
            continue

        slug = data["slug"]
        md_filename = data["filename"]
        md_path = LEGACY_DIR / md_filename

        if not md_path.exists():
            print(f"Warning: {md_path} not found.")
            continue

        page_assets_dir = ASSETS_DIR / slug
        if not page_assets_dir.exists():
            page_assets_dir.mkdir(parents=True)

        content = md_path.read_text()

        def replace_image(match):
            alt_text = match.group(1)
            img_path_str = match.group(2)

            if img_path_str.startswith("http") or img_path_str.startswith("//"):
                return match.group(0)

            # Paths in markdown are relative to legacy/ e.g. "images/slug/file.jpg"
            old_img_path = LEGACY_DIR / img_path_str

            if not old_img_path.exists():
                # Try finding it in legacy/images root
                filename = Path(img_path_str).name
                potential_path = IMAGES_DIR_LEGACY / filename
                if potential_path.exists():
                    old_img_path = potential_path
                else:
                    # Check legacy/images/{slug}/
                    potential_path_slug = IMAGES_DIR_LEGACY / slug / filename
                    if potential_path_slug.exists():
                        old_img_path = potential_path_slug
                    else:
                        # Try to find it recursively in legacy/images
                        found = False
                        for root, dirs, files in os.walk(IMAGES_DIR_LEGACY):
                            if filename in files:
                                old_img_path = Path(root) / filename
                                found = True
                                break
                        if not found:
                            # print(f"Warning: Image {img_path_str} not found for {slug}")
                            return match.group(0)

            filename = old_img_path.name
            new_img_path = page_assets_dir / filename

            if not new_img_path.exists():
                shutil.copy2(old_img_path, new_img_path)

            # Markdown is in legacy/ so path to assets is ../assets/slug/filename
            return f"![{alt_text}](../assets/{slug}/{filename})"

        new_content = re.sub(r'!\[(.*?)\]\((.*?)\)', replace_image, content)
        md_path.write_text(new_content)
        # print(f"Migrated {slug}")

def scrape_next_batch(batch_size=5):
    """Scrapes next batch of pages."""
    if not STATUS_FILE.exists():
        print(f"Error: {STATUS_FILE} not found.")
        return

    with open(STATUS_FILE, "r") as f:
        status_data = json.load(f)

    to_scrape = []
    for url, data in status_data.items():
        if not data.get("scraped"):
            to_scrape.append((url, data["slug"]))
            if len(to_scrape) >= batch_size:
                break

    if not to_scrape:
        print("No more pages to scrape.")
        return

    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Use a real user agent to avoid being blocked
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        page = context.new_page()

        for url, slug in to_scrape:
            print(f"Scraping {url}...")
            try:
                page.goto(url, timeout=90000, wait_until="domcontentloaded")

                # Wait for protection to pass
                try:
                    # Wait until title doesn't contain "Checking your browser"
                    # This might fail if the site is really slow or blocks completely
                    page.wait_for_function("() => !document.title.includes('Checking your browser')", timeout=30000)

                    # Wait for main content
                    page.wait_for_selector("article, .entry-content, main, body.home, body.blog", timeout=30000)

                    # Extra wait to ensure content is fully rendered
                    page.wait_for_timeout(2000)

                except Exception as e:
                    print(f"Timeout or error waiting for content on {url}. Title: {page.title()}")
                    continue

                title = page.title()
                if "Checking your browser" in title:
                    print(f"Failed to bypass protection for {url}")
                    continue

                # Extract HTML content
                content_html = page.evaluate("""() => {
                    const article = document.querySelector('article') || document.querySelector('.entry-content') || document.querySelector('main') || document.body;
                    return article.innerHTML;
                }""")

                # Convert to Markdown
                h = html2text.HTML2Text()
                h.ignore_links = False
                h.ignore_images = False
                h.body_width = 0
                markdown_content = f"# {title}\n\n{h.handle(content_html)}"

                md_filename = f"{slug}.md"
                md_path = LEGACY_DIR / md_filename

                page_assets_dir = ASSETS_DIR / slug
                if not page_assets_dir.exists():
                    page_assets_dir.mkdir(parents=True)

                def download_image(match):
                    alt = match.group(1)
                    img_url = match.group(2)

                    if not img_url.startswith("http"):
                        return match.group(0)

                    filename = Path(img_url).name.split('?')[0]
                    # Sanitize filename
                    filename = re.sub(r'[^\w\-_\.]', '_', filename)
                    if not filename:
                        filename = "image.jpg"

                    filepath = page_assets_dir / filename

                    try:
                        # Use requests with timeout
                        response = requests.get(img_url, stream=True, timeout=20, headers={'User-Agent': 'Mozilla/5.0'})
                        if response.status_code == 200:
                            with open(filepath, 'wb') as f:
                                response.raw.decode_content = True
                                shutil.copyfileobj(response.raw, f)
                            return f"![{alt}](../assets/{slug}/{filename})"
                    except Exception as e:
                        print(f"Failed to download {img_url}: {e}")

                    return match.group(0)

                markdown_content = re.sub(r'!\[(.*?)\]\((.*?)\)', download_image, markdown_content)

                md_path.write_text(markdown_content)

                status_data[url]["scraped"] = True
                status_data[url]["filename"] = md_filename

                print(f"Scraped {slug}")

            except Exception as e:
                print(f"Error scraping {url}: {e}")

        browser.close()

    with open(STATUS_FILE, "w") as f:
        json.dump(status_data, f, indent=2)

if __name__ == "__main__":
    print("Starting migration...")
    migrate_existing_content()
    print("Migration complete. Starting scraping...")
    scrape_next_batch(batch_size=20)
    print("Done.")
