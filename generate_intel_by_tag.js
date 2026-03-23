const fs = require("fs");
const path = require("path");

const ARTICLES_DIR = "data/dict/articles";

const categoriesMapping = {
  "Military & Defense": ["Military", "Defense", "War", "NATO", "Combat", "Strategic Reserve", "Tactics", "ROE", "Militancy", "Force", "Arm", "Victory", "Defensive", "Airlift", "Aviation", "Weaponry", "Soldier", "Trench", "Deployment", "Pentagon", "Artillery", "Paramilitary"],
  "Intelligence & Espionage": ["Intelligence", "Intel", "Spy", "Surveillance", "Covert", "OSINT", "GEOINT", "Espionage", "Counterintelligence", "Psy-Op", "Information Warfare", "Clandestine", "Harsher Punishment", "Signals", "Sigint", "Informant", "Secret Police", "NKVD", "Stasi", "KGB", "Siloviki", "Cabal", "Operation", "Clandestine", "Rumint"],
  "Technology & AI": ["AI", "Tech", "Digital", "Cyber", "Satellite", "Algorithm", "Neuro", "Synthetic", "Automation", "Encryption", "Privacy", "Implantable", "Laser", "Data", "Infra", "Online", "Network"],
  "Law, Crime & Corruption": ["Crime", "Mafia", "Trafficking", "Corruption", "Law", "Legal", "Police", "Justice", "Nepotism", "Blackmail", "Syndicate", "Prosecut", "Extortion", "Scandal", "Laundering", "Investigation", "Audit", "Fraud", "Homicide", "Suicide", "Murder", "Prison", "Offender", "BTK", "Penal", "Court"],
  "Social & Psychology": ["Social", "Psychology", "Psychopath", "Trauma", "Education", "Humanism", "Child", "Youth", "Family", "Societal", "Well-Being", "Pedagogy", "Health", "Welfare", "Integration", "Community", "Empathy", "Behavioral", "Individualism", "Narcissism", "Demographics", "Population", "Care", "Student", "Life", "Culture", "Everydayism"],
  "Geopolitics": ["Global", "International", "US", "USA", "Russia", "China", "Ukraine", "Europe", "Eurasia", "Geopolitical", "Foreign", "Electoral", "Western", "Imperialism", "Colonialism", "Empire", "Peace", "Conflict", "Diplomacy", "Alliance", "United Nations", "UN", "USSR", "Greenland", "Arctic", "Israel", "Venezuela", "Germany", "Lithuania", "Mexico"],
  "Hungary": ["Hungary", "Hungarian", "Budapest", "Orban", "Fidesz", "NER", "Alaptörvény", "TEK", "Pannonian", "Szájer", "KSH", "Katonai", "Jelentés", "Magyar", "Belföld", "Ügyek"]
};

function parseYAML(content) {
  const result = {};
  const lines = content.split("\n");
  let currentKey = null;
  let isList = false;

  lines.forEach(line => {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) {
      currentKey = match[1];
      let value = match[2].trim();
      if (value === "") {
        isList = true;
        result[currentKey] = [];
      } else {
        isList = false;
        value = value.replace(/^["\']|["\']$/g, "");
        result[currentKey] = value;
      }
    } else if (isList && line.trim().startsWith("- ")) {
      let item = line.trim().substring(2).trim();
      item = item.replace(/^["\']|["\']$/g, "");
      result[currentKey].push(item);
    }
  });
  return result;
}

function getCategory(tag) {
  for (const [category, keywords] of Object.entries(categoriesMapping)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(tag)) {
        return category;
      }
    }
  }
  return "Miscellaneous";
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

  const categorisedTags = {};

  articles.forEach(article => {
    if (article.tags && article.tags.length > 0) {
      article.tags.forEach(tag => {
        const category = getCategory(tag);
        if (!categorisedTags[category]) {
          categorisedTags[category] = {};
        }
        if (!categorisedTags[category][tag]) {
          categorisedTags[category][tag] = [];
        }
        if (!categorisedTags[category][tag].some(a => a.slug === article.slug)) {
            categorisedTags[category][tag].push(article);
        }
      });
    }
  });

  const sortedCategories = Object.keys(categorisedTags).sort((a, b) => {
      if (a === "Miscellaneous") return 1;
      if (b === "Miscellaneous") return -1;
      return a.localeCompare(b);
  });

  let output = "# Intel Articles by Category and Tag\n\n";

  for (const category of sortedCategories) {
    output += `# ${category}\n\n`;
    const tagsMap = categorisedTags[category];
    const sortedTags = Object.keys(tagsMap).sort((a, b) => a.localeCompare(b));

    for (const tag of sortedTags) {
      output += `## ${tag}\n\n`;
      tagsMap[tag].sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          return titleA.localeCompare(titleB);
      }).forEach(article => {
        output += `- [${article.title}](https://intelkartel.com/blog/${article.slug})\n`;
      });
      output += "\n";
    }
    output += "---\n\n";
  }

  if (missingTags.length > 0) {
    output += `# Articles Missing Tags\n\n`;
    missingTags.sort((a, b) => a.title.localeCompare(b.title)).forEach(article => {
      output += `- [${article.title}](https://intelkartel.com/blog/${article.slug})\n`;
    });
    output += "\n---\n\n";
  }

  if (missingMetadata.length > 0) {
    output += `# Articles Missing YAML Metadata\n\n`;
    missingMetadata.sort((a, b) => a.title.localeCompare(b.title)).forEach(article => {
      output += `- [${article.title}](https://intelkartel.com/blog/${article.slug})\n`;
    });
    output += "\n";
  }

  fs.writeFileSync("intel_by_tag.md", output);
  console.log("intel_by_tag.md has been generated.");
}

main();
