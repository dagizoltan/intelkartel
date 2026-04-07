import { BlogPage } from "./blog-page.jsx";
import { TagsPage } from "./tags-page.jsx";
import { TagDetailPage } from "./tag-detail-page.jsx";
import { ArticleView } from "../../components/ArticleView.jsx";
import { getArticles, getTags, getArticlesByTag, getRelatedArticles } from "../../services/article-service.js";
import { parse } from "@std/yaml";

const ARTICLES_DIR = "data/dict/articles";

const getArticle = async (slug) => {
  try {
    const mdFilename = `${slug}.md`;
    const yamlFilename = `${slug}.yaml`;
    let content;
    let yamlContent;
    let meta = null;

    try {
        content = await Deno.readTextFile(`${ARTICLES_DIR}/${mdFilename}`);
    } catch {
        return null;
    }

    try {
        yamlContent = await Deno.readTextFile(`${ARTICLES_DIR}/${yamlFilename}`);
        const yamlData = parse(yamlContent);
        meta = {
          title: yamlData.title || slug,
          subtitle: yamlData.subtitle || "",
          description: yamlData.summary || "",
          datePublished: yamlData.datePublished || "1970-01-01",
          slug: yamlData.slug || slug,
          image: yamlData.image || null,
          tags: yamlData.tags || []
        };
    } catch (e) {
        // Fallback or skip if yaml is not found?
        // Let's assume the user only wants to show articles with YAML metadata,
        // or we can fall back to the slug as the title.
        console.warn(`Missing or invalid YAML metadata for ${slug}, skipping...`);
        return null; // Enforce YAML files based on the requirement to only show articles that have a YAML file
    }

    return { meta, content };
  } catch (e) {
    console.error(`Error fetching article ${slug}:`, e);
    return null;
  }
};

export const blogHandler = {
  index: async (c) => {
    const lang = c.req.param('lang') || 'en';
    const t = await c.dict(`src/interface/web/handlers/blog/dict/${lang}`);
    const articles = await getArticles();
    const allTags = await getTags();
    const topTags = allTags.slice(0, 10);
    const seo = {
      title: t.meta?.title || "Intel - IntelKartel",
      description: t.meta?.description || "IntelKartel Intelligence Stream",
      canonical: "https://intelkartel.com/blog"
    };

    return c.render(BlogPage, { articles, topTags, seo, t });
  },

  detail: async (c) => {
    const slug = c.req.param('slug');
    const lang = c.req.param('lang') || 'en';
    const t = await c.dict(`src/interface/web/handlers/blog/dict/${lang}`);
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

    const relatedArticles = await getRelatedArticles(article.meta, 3);

    return c.render(ArticleView, { article: article.meta, content: article.content, relatedArticles, seo, t });
  },

  tags: async (c) => {
    const lang = c.req.param('lang') || 'en';
    const t = await c.dict(`src/interface/web/handlers/blog/dict/${lang}`);
    const tags = await getTags();
    const seo = {
      title: `Intel Tags - IntelKartel`,
      description: "Browse IntelKartel reports by topic and tag.",
      canonical: "https://intelkartel.com/blog/tags"
    };

    return c.render(TagsPage, { tags, seo, t });
  },

  tagDetail: async (c) => {
    const tag = c.req.param('tag');
    const lang = c.req.param('lang') || 'en';
    const t = await c.dict(`src/interface/web/handlers/blog/dict/${lang}`);
    const articles = await getArticlesByTag(tag);

    // Find the original tag name (with correct casing)
    const tagName = articles.length > 0
        ? articles[0].tags.find(t => t.toLowerCase() === tag.toLowerCase())
        : tag;

    const seo = {
      title: `${tagName} Intel - IntelKartel`,
      description: `Intelligence reports and analysis tagged with ${tagName}.`,
      canonical: `https://intelkartel.com/blog/tags/${tag.toLowerCase()}`
    };

    return c.render(TagDetailPage, { tag: tagName, articles, seo, t });
  }
};
