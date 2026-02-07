import { HomePage } from "./home-page.jsx";
import { homeHandlerSeo } from "./home-handler-seo.js";

export const homeHandler = {
  get: async (c) => {
    const lang = c.req.param('lang');
    const t = await c.dict(`src/interface/web/handlers/home/dict/${lang}`);
    const seo = homeHandlerSeo.getSeo(t, lang);
    return c.render(HomePage, { t, lang, seo, preloadImage: '/static/img/image_67534337.webp' });
  }
};
