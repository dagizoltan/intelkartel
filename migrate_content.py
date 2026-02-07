import os
import xml.etree.ElementTree as ET
import re
import yaml
from pathlib import Path

# Paths
LEGACY_DIR = 'legacy'
SITEMAP_FILE = 'sitemap.xml'
DATA_DIR = 'data/dict/articles'

# Namespace for sitemap
NS = {
    'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'image': 'http://www.google.com/schemas/sitemap-image/1.1'
}

def parse_sitemap():
    tree = ET.parse(SITEMAP_FILE)
    root = tree.getroot()
    url_map = {}

    for url in root.findall('sitemap:url', NS):
        loc = url.find('sitemap:loc', NS).text
        lastmod_elem = url.find('sitemap:lastmod', NS)
        lastmod = lastmod_elem.text if lastmod_elem is not None else None

        images = []
        for img in url.findall('image:image', NS):
            img_loc = img.find('image:loc', NS).text
            if img_loc:
                images.append(img_loc)

        # Extract slug from URL
        # URL format: https://intelkartel.com/2026/02/06/intel-283-93-39-3938-3893-333/
        # OR https://intelkartel.com/mind-read-map-and-ear-skull-phone/

        slug = loc.rstrip('/').split('/')[-1]

        url_map[slug] = {
            'loc': loc,
            'lastmod': lastmod,
            'images': images
        }
    return url_map

def migrate():
    print("Parsing sitemap...")
    url_map = parse_sitemap()
    print(f"Found {len(url_map)} URLs in sitemap.")

    # Ensure output dir exists
    Path(DATA_DIR).mkdir(parents=True, exist_ok=True)

    files = os.listdir(LEGACY_DIR)
    migrated_count = 0

    for filename in files:
        if not filename.endswith('.md'):
            continue

        file_path = os.path.join(LEGACY_DIR, filename)

        # Parse filename: YYYY-MM-DD-slug.md
        # e.g. 2026-01-27-intel-3883-48-494-39-3.md
        match = re.match(r'(\d{4}-\d{2}-\d{2})-(.+)\.md', filename)

        if match:
            date_published = match.group(1)
            slug = match.group(2)
        else:
            # Fallback for files like 'ethics-table.md'
            slug = filename.replace('.md', '')
            date_published = '2026-01-01' # Default fallback

        # Get content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract title (first line)
        lines = content.split('\n')
        title = "Untitled"
        body_start = 0

        if lines and lines[0].startswith('# '):
            title = lines[0][2:].strip()
            body_start = 1

        # Refine content (remove first line if it was title)
        body = '\n'.join(lines[body_start:])

        # Get metadata from sitemap
        sitemap_data = url_map.get(slug, {})
        lastmod = sitemap_data.get('lastmod', date_published) # Use published date if no lastmod

        # Image
        image = None
        if sitemap_data.get('images'):
            image = sitemap_data['images'][0]

        # Fix image paths in body
        # Pattern: ../assets/
        body = body.replace('../assets/', '/static/assets/')

        # Find first image in body for cover image if not in sitemap
        if not image:
            img_match = re.search(r'!\[.*?\]\((/static/assets/[^)]+)\)', body)
            if img_match:
                image = img_match.group(1)

        # Construct YAML data
        meta = {
            'title': title,
            'description': title, # Placeholder
            'slug': slug,
            'author': 'IntelKartel',
            'datePublished': date_published,
            'dateModified': lastmod,
            'tags': [],
            'image': image,
            'canonical': sitemap_data.get('loc', f'https://intelkartel.com/{slug}'),
            'seo': {
                'title': title,
                'description': title
            }
        }

        # Create article directory
        article_dir = os.path.join(DATA_DIR, slug)
        Path(article_dir).mkdir(parents=True, exist_ok=True)

        # Write index.yaml
        with open(os.path.join(article_dir, 'index.yaml'), 'w', encoding='utf-8') as f:
            yaml.dump(meta, f, default_flow_style=False, sort_keys=False)

        # Write content.md
        with open(os.path.join(article_dir, 'content.md'), 'w', encoding='utf-8') as f:
            f.write(body)

        migrated_count += 1

    print(f"Migrated {migrated_count} articles.")

if __name__ == '__main__':
    migrate()
