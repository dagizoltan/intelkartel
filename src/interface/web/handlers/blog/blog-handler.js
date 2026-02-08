import { BlogPage } from "./blog-page.jsx";
import { ArticleView } from "../../components/ArticleView.jsx";
import { parseArticle } from "../../utils/article-parser.js";
import { getArticles } from "../../services/article-service.js";

const ARTICLES_DIR = "data/dict/articles";

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
    const lang = c.req.param('lang') || 'en';
    const t = await c.dict(`src/interface/web/handlers/blog/dict/${lang}`);
    const articles = await getArticles();
    const seo = {
      title: t.meta?.title || "Intel - IntelKartel",
      description: t.meta?.description || "IntelKartel Intelligence Stream",
      canonical: "https://intelkartel.com/blog"
    };

    return c.render(BlogPage, { articles, seo, t });
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
