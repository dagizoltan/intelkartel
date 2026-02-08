import re
import os

def get_css_selectors(css_file):
    with open(css_file, 'r') as f:
        content = f.read()

    # Simple regex to find class names and IDs
    # This is a basic parser and might not catch everything perfectly, but should be good enough
    class_pattern = r'\.([a-zA-Z0-9_-]+)'
    id_pattern = r'#([a-zA-Z0-9_-]+)'

    classes = set(re.findall(class_pattern, content))
    ids = set(re.findall(id_pattern, content))

    # Filter out pseudo-classes/elements if captured by mistake (though regex above is restrictive)
    # Actually the regex above captures things like .btn:hover as 'btn' which is correct.
    # But it might capture .0 if it starts with digit? CSS allows escaped digits but let's assume standard names.

    return classes, ids

def search_usage(root_dir, names, file_extensions):
    used = set()
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if any(file.endswith(ext) for ext in file_extensions):
                filepath = os.path.join(root, file)
                # Skip the CSS file itself
                if filepath.endswith('.css'):
                    continue

                with open(filepath, 'r') as f:
                    try:
                        content = f.read()
                    except UnicodeDecodeError:
                        continue

                    for name in names:
                        # Simple check: is the name in the file content?
                        # This might give false positives (e.g. "hero" in a text), but better than false negatives.
                        # For classes, often used as class="hero" or className="hero" or classList.add("hero")
                        if name in content:
                            used.add(name)
    return used

css_file = 'src/interface/web/static/styles.css'
search_dir = 'src/interface/web/'
extensions = ['.jsx', '.js', '.ts', '.tsx', '.html']

defined_classes, defined_ids = get_css_selectors(css_file)

print(f"Found {len(defined_classes)} classes and {len(defined_ids)} IDs in {css_file}")

used_classes = search_usage(search_dir, defined_classes, extensions)
used_ids = search_usage(search_dir, defined_ids, extensions)

unused_classes = defined_classes - used_classes
unused_ids = defined_ids - used_ids

print("\nPotentially unused classes:")
for cls in sorted(unused_classes):
    print(f".{cls}")

print("\nPotentially unused IDs:")
for i in sorted(unused_ids):
    print(f"#{i}")
