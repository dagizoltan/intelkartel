import { BlogPage } from "./blog-page.jsx";
import { ArticleView } from "../../components/ArticleView.jsx";
import { parseArticle } from "../../utils/article-parser.js";

const ARTICLES_DIR = "data/dict/articles";

let articlesCache = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache

const getArticles = async () => {
  const now = Date.now();
  if (articlesCache && (now - lastCacheTime < CACHE_TTL)) {
    return articlesCache;
  }

  const entries = [];
  try {
    for await (const entry of Deno.readDir(ARTICLES_DIR)) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        try {
          const content = await Deno.readTextFile(`${ARTICLES_DIR}/${entry.name}`);
          const meta = parseArticle(entry.name, content);
          // Remove content from the list object to save memory
          delete meta.content;
          entries.push(meta);
        } catch (e) {
          console.error(`Error reading article ${entry.name}:`, e);
        }
      }
    }

    // Sort by date descending
    articlesCache = entries.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
    lastCacheTime = now;
  } catch (e) {
    console.error("Error reading articles dir:", e);
    // Return empty array or cached if available (though if error occurs, cache might be stale or null)
    return articlesCache || [];
  }

  return articlesCache;
};

const getArticle = async (slug) => {
  try {
    const filename = `${slug}.md`;
    let content;
    try {
        content = await Deno.readTextFile(`${ARTICLES_DIR}/${filename}`);
    } catch {
        return null;
    }

    const parsed = parseArticle(filename, content);
    return { meta: parsed, content: parsed.content };
  } catch (e) {
    console.error(`Error fetching article ${slug}:`, e);
    return null;
  }
};

export const blogHandler = {
  index: async (c) => {
    const articles = await getArticles();
    const seo = {
      title: "Intel - IntelKartel",
      description: "IntelKartel Intelligence Stream",
      canonical: "https://intelkartel.com/blog"
    };

    return c.render(BlogPage, { articles, seo });
  },

  detail: async (c) => {
    const slug = c.req.param('slug');
    const article = await getArticle(slug);

    if (!article) {
      return c.notFound();
    }

    const seo = {
        title: article.meta.title,
        description: article.meta.description,
        image: article.meta.image,
        canonical: `https://intelkartel.com/blog/${article.meta.slug}`
    };

    // Add schema.org Article
    seo.jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.meta.title,
        "image": article.meta.image ? [article.meta.image] : [],
        "datePublished": article.meta.datePublished,
        "dateModified": article.meta.datePublished,
        "author": {
            "@type": "Person",
            "name": "IntelKartel"
        }
    };

    return c.render(ArticleView, { article: article.meta, content: article.content, seo });
  }
};
