import { ArticleCard } from "../../components/ArticleCard.jsx";
import { ArticleView } from "../../components/ArticleView.jsx";
import { renderMarkdown } from "../../utils/markdown.js";
import { parse } from "@std/yaml";

const ARTICLES_DIR = "data/dict/articles";

const getArticles = async () => {
  const entries = [];
  try {
    for await (const entry of Deno.readDir(ARTICLES_DIR)) {
      if (entry.isDirectory) {
        try {
          const yamlContent = await Deno.readTextFile(`${ARTICLES_DIR}/${entry.name}/index.yaml`);
          const meta = parse(yamlContent);
          entries.push(meta);
        } catch (e) {
          console.error(`Error reading article ${entry.name}:`, e);
        }
      }
    }
  } catch (e) {
    console.error("Error reading articles dir:", e);
  }
  // Sort by date descending
  return entries.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
};

const getArticle = async (slug) => {
  try {
    const yamlContent = await Deno.readTextFile(`${ARTICLES_DIR}/${slug}/index.yaml`);
    const content = await Deno.readTextFile(`${ARTICLES_DIR}/${slug}/content.md`);
    const meta = parse(yamlContent);
    return { meta, content: renderMarkdown(content) };
  } catch (e) {
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

    const BlogIndex = () => (
      <div class="container">
        <h1>Intel Stream</h1>
        <div class="articles-list">
          {articles.map(article => <ArticleCard article={article} />)}
        </div>
      </div>
    );

    return c.render(BlogIndex, { seo });
  },

  detail: async (c) => {
    const slug = c.req.param('slug');
    const article = await getArticle(slug);

    if (!article) {
      return c.notFound();
    }

    const seo = article.meta.seo || {
        title: article.meta.title,
        description: article.meta.description,
        image: article.meta.image,
        canonical: article.meta.canonical
    };

    // Add schema.org Article
    seo.jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.meta.title,
        "image": article.meta.image ? [article.meta.image] : [],
        "datePublished": article.meta.datePublished,
        "dateModified": article.meta.dateModified || article.meta.datePublished,
        "author": {
            "@type": "Person",
            "name": article.meta.author || "IntelKartel"
        }
    };

    return c.render(ArticleView, { article: article.meta, content: article.content, seo });
  }
};
