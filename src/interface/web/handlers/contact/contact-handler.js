import { ContactPage } from "./contact-page.jsx";
import { contactHandlerSeo } from "./contact-handler-seo.js";

export const contactHandler = {
  get: async (c) => {
    const lang = c.req.param('lang') || 'en';
    const t = await c.dict(`src/interface/web/handlers/contact/dict/${lang}`);
    const seo = contactHandlerSeo.getSeo(t, lang);
    return c.render(ContactPage, { t, lang, seo });
  }
};
