import json
from pathlib import Path

STATUS_FILE = Path("scraping_status.json")

urls_to_reset = [
    "https://intelkartel.com/2026/01/30/intel-9-494-494-59-494/",
    "https://intelkartel.com/2026/01/28/intel-304-30-430-40-3-30/",
    "https://intelkartel.com/2026/01/28/intel-38-39-49-20-2-202-666-69-420-517/"
]

with open(STATUS_FILE, "r") as f:
    data = json.load(f)

for url in urls_to_reset:
    if url in data:
        data[url]["scraped"] = False
        print(f"Reset {url}")

with open(STATUS_FILE, "w") as f:
    json.dump(data, f, indent=2)
