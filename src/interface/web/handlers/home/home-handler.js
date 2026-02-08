import { HomePage } from "./home-page.jsx";
import { getLatestArticles } from "../../services/article-service.js";

export const homeHandler = {
  get: async (c) => {
    const lang = c.req.param('lang') || 'en';
    const t = await c.dict(`src/interface/web/handlers/home/dict/${lang}`);
    const articles = await getLatestArticles(10);
    const seo = {
      title: t.meta?.title || "IntelKartel - The Intelligence Cartel",
      description: t.meta?.description || "Editorial and thought leadership from the front lines.",
      canonical: "https://intelkartel.com/"
    };

    return c.render(HomePage, { articles, seo, t });
  }
};
