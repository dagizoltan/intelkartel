export const sitemapHandler = {
  get: (c) => {
    const languages = ['en', 'es', 'ca'];
    const pages = ['', '/menu', '/about', '/contact'];
    const url = new URL(c.req.url);
    const domain = url.origin;

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    languages.forEach(lang => {
      pages.forEach(page => {
        const pageUrl = `${domain}/${lang}${page}`;
        sitemap += `
  <url>
    <loc>${pageUrl}</loc>
    ${languages.map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${domain}/${l}${page}"/>`).join('\n    ')}
  </url>`;
      });
    });

    sitemap += `
</urlset>`;

    return c.text(sitemap, 200, { 'Content-Type': 'application/xml; charset=UTF-8' });
  }
};
