import { MenuPage } from "./menu-page.jsx";
import { menuHandlerSeo } from "./menu-handler-seo.js";

export const menuHandler = {
  get: async (c) => {
    const lang = c.req.param('lang');
    const t = await c.dict(`src/interface/web/handlers/menu/dict/${lang}`);
    const seo = menuHandlerSeo.getSeo(t, lang);
    return c.render(MenuPage, { t, lang, seo });
  }
};
