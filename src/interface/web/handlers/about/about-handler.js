import { AboutPage } from "./about-page.jsx";
import { aboutHandlerSeo } from "./about-handler-seo.js";

export const aboutHandler = {
  get: async (c) => {
    const lang = c.req.param('lang') || 'en';
    const t = await c.dict(`src/interface/web/handlers/about/dict/${lang}`);
    const seo = aboutHandlerSeo.getSeo(t, lang);
    return c.render(AboutPage, { t, lang, seo });
  }
};
