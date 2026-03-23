import { parse } from "@std/yaml";

const ARTICLES_DIR = "data/dict/articles";
const CAREERS_DATA_PATH = "data/dict/careers.yaml";

let articlesCache = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache

export const getArticles = async () => {
  const now = Date.now();
  if (articlesCache && (now - lastCacheTime < CACHE_TTL)) {
    return articlesCache;
  }

  const entries = [];
  try {
    for await (const entry of Deno.readDir(ARTICLES_DIR)) {
      if (entry.isFile && entry.name.endsWith(".yaml")) {
        try {
          const content = await Deno.readTextFile(`${ARTICLES_DIR}/${entry.name}`);
          // Parse the YAML using std library
          const yamlData = parse(content);
          const meta = {
            title: yamlData.title || entry.name.replace(".yaml", ""),
            subtitle: yamlData.subtitle || "",
            description: yamlData.summary || "",
            datePublished: yamlData.datePublished || "1970-01-01",
            slug: yamlData.slug || entry.name.replace(".yaml", ""),
            image: yamlData.image || null,
            tags: yamlData.tags || []
          };
          entries.push(meta);
        } catch (e) {
          console.error(`Error reading article yaml ${entry.name}:`, e);
        }
      }
    }

    // Sort by date descending.
    // If datePublished is null or "1970-01-01", it will be considered very old.
    articlesCache = entries.sort((a, b) => {
        const dateA = new Date(a.datePublished || "1970-01-01");
        const dateB = new Date(b.datePublished || "1970-01-01");
        return dateB - dateA;
    });
    lastCacheTime = now;
  } catch (e) {
    console.error("Error reading articles dir:", e);
    // Return empty array or cached if available
    return articlesCache || [];
  }

  return articlesCache;
};

export const getLatestArticles = async (limit = 10) => {
  const articles = await getArticles();
  return articles.slice(0, limit);
};

export const getTags = async () => {
    const articles = await getArticles();
    const tagsMap = {};

    articles.forEach(article => {
        if (article.tags) {
            article.tags.forEach(tag => {
                tagsMap[tag] = (tagsMap[tag] || 0) + 1;
            });
        }
    });

    return Object.entries(tagsMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export const getArticlesByTag = async (tag) => {
    const articles = await getArticles();
    return articles.filter(article =>
        article.tags && article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
};

export const getCareers = async () => {
  try {
    const yamlContent = await Deno.readTextFile(CAREERS_DATA_PATH);
    return parse(yamlContent);
  } catch (e) {
    console.error("Error reading careers data:", e);
    return [];
  }
};
