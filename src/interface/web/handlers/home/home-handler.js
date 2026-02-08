import { parse } from "@std/yaml";
import { HomePage } from "./home-page.jsx";

const ARTICLES_DIR = "data/dict/articles";

const getLatestArticles = async (limit = 5) => {
  const entries = [];
  try {
    for await (const entry of Deno.readDir(ARTICLES_DIR)) {
      if (entry.isDirectory) {
        try {
          const yamlContent = await Deno.readTextFile(`${ARTICLES_DIR}/${entry.name}/index.yaml`);
          const meta = parse(yamlContent);
          entries.push(meta);
        } catch (e) {}
      }
    }
  } catch (e) {}
  return entries.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished)).slice(0, limit);
};

export const homeHandler = {
  get: async (c) => {
    const lang = c.req.param('lang') || 'en';
    const t = await c.dict(`src/interface/web/handlers/home/dict/${lang}`);
    const articles = await getLatestArticles(5);
    const seo = {
      title: t.meta?.title || "IntelKartel - The Intelligence Cartel",
      description: t.meta?.description || "Editorial and thought leadership from the front lines.",
      canonical: "https://intelkartel.com/"
    };

    return c.render(HomePage, { articles, seo, t });
  }
};
