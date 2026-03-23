const fs = require("fs");
const path = require("path");

const ARTICLES_DIR = "data/dict/articles";

function parseYAML(content) {
  const result = {};
  const lines = content.split("\n");
  let currentKey = null;
  let isList = false;

  lines.forEach(line => {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) {
      currentKey = match[1];
      const value = match[2].trim();
      if (value === "") {
        isList = true;
        result[currentKey] = [];
      } else {
        isList = false;
        result[currentKey] = value.replace(/^["\x27]|["\x27]$/g, "");
      }
    } else if (isList && line.trim().startsWith("- ")) {
      result[currentKey].push(line.trim().substring(2).replace(/^["\x27]|["\x27]$/g, ""));
    }
  });
  return result;
}

function main() {
  const files = fs.readdirSync(ARTICLES_DIR);
  const articles = [];
  const missingMetadata = [];
  const missingTags = [];

  const mdFiles = files.filter(f => f.endsWith(".md"));

  mdFiles.forEach(file => {
    const slug = file.replace(".md", "");
    const yamlFile = slug + ".yaml";

    if (fs.existsSync(path.join(ARTICLES_DIR, yamlFile))) {
      try {
        const content = fs.readFileSync(path.join(ARTICLES_DIR, yamlFile), "utf8");
        const yamlData = parseYAML(content);
        const meta = {
          title: yamlData.title || slug,
          tags: yamlData.tags || [],
          slug: yamlData.slug || slug,
        };
        if (!meta.tags || meta.tags.length === 0) {
          missingTags.push(meta);
        }
        articles.push(meta);
      } catch (e) {
        missingMetadata.push({ title: slug, slug: slug });
      }
    } else {
      missingMetadata.push({ title: slug, slug: slug });
    }
  });

  const tagsMap = {};

  articles.forEach(article => {
    if (article.tags && article.tags.length > 0) {
      article.tags.forEach(tag => {
        if (!tagsMap[tag]) {
          tagsMap[tag] = [];
        }
        tagsMap[tag].push(article);
      });
    }
  });

  const sortedTags = Object.keys(tagsMap).sort((a, b) => a.localeCompare(b));

  let output = "# Intel Articles by Tag\n\n";

  for (const tag of sortedTags) {
    output += `## ${tag}\n\n`;
    tagsMap[tag].sort((a, b) => a.title.localeCompare(b.title)).forEach(article => {
      output += `- [${article.title}](https://intelkartel.com/blog/${article.slug})\n`;
    });
    output += "\n";
  }

  if (missingTags.length > 0) {
    output += `## Articles Missing Tags\n\n`;
    missingTags.sort((a, b) => a.title.localeCompare(b.title)).forEach(article => {
      output += `- [${article.title}](https://intelkartel.com/blog/${article.slug})\n`;
    });
    output += "\n";
  }

  if (missingMetadata.length > 0) {
    output += `## Articles Missing YAML Metadata\n\n`;
    missingMetadata.sort((a, b) => a.title.localeCompare(b.title)).forEach(article => {
      output += `- [${article.title}](https://intelkartel.com/blog/${article.slug})\n`;
    });
    output += "\n";
  }

  fs.writeFileSync("intel_by_tag.md", output);
  console.log("intel_by_tag.md has been generated.");
}

main();
