import { renderMarkdown } from "../../utils/markdown.js";
import { StaticPage } from "./static-page.jsx";

const contactContent = `
# Contact IntelKartel

We are listening.

**Email:** contact@intelkartel.com
`;

const aboutContent = `
# About IntelKartel

**IntelKartel** is an intelligence agency for the people.

We provide:
*   Unfiltered Analysis
*   Strategic Insight
*   Core Interest Defense
`;

export const staticHandler = {
  about: (c) => {
    const content = renderMarkdown(aboutContent);
    const seo = {
        title: "About - IntelKartel",
        description: "About IntelKartel",
        canonical: "https://intelkartel.com/about"
    };

    return c.render(StaticPage, { content, seo });
  },

  contact: (c) => {
    const content = renderMarkdown(contactContent);
    const seo = {
        title: "Contact - IntelKartel",
        description: "Contact IntelKartel",
        canonical: "https://intelkartel.com/contact"
    };

    return c.render(StaticPage, { content, seo });
  }
};
