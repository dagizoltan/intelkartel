import os
from bs4 import BeautifulSoup

def extract_assets(data_dir='data', output_file='assets_list.txt'):
    if not os.path.exists(data_dir):
        print(f"Error: {data_dir} does not exist.")
        return

    asset_urls = set()
    files = os.listdir(data_dir)
    print(f"Scanning {len(files)} files in {data_dir}...")

    for filename in files:
        filepath = os.path.join(data_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                soup = BeautifulSoup(content, 'html.parser')

                # Images
                for img in soup.find_all('img'):
                    src = img.get('src')
                    if src:
                        asset_urls.add(src)
                    # Also check data-orig-file if available (often in WP)
                    orig = img.get('data-orig-file')
                    if orig:
                        asset_urls.add(orig)

                # Videos
                for video in soup.find_all('video'):
                    src = video.get('src')
                    if src:
                        asset_urls.add(src)
                    for source in video.find_all('source'):
                        src = source.get('src')
                        if src:
                            asset_urls.add(src)

                # Audio
                for audio in soup.find_all('audio'):
                    src = audio.get('src')
                    if src:
                        asset_urls.add(src)
                    for source in audio.find_all('source'):
                        src = source.get('src')
                        if src:
                            asset_urls.add(src)

                # Links to assets (sometimes PDFs or images are linked)
                for a in soup.find_all('a'):
                    href = a.get('href')
                    if href and href.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.mp4', '.mp3', '.wav')):
                        asset_urls.add(href)

        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print(f"Found {len(asset_urls)} unique assets.")

    with open(output_file, 'w') as f:
        for url in sorted(asset_urls):
            f.write(url + '\n')

    print(f"Saved asset list to {output_file}")

if __name__ == "__main__":
    extract_assets()
