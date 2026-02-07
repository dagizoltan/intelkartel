export const robotsHandler = {
  get: (c) => {
    const url = new URL(c.req.url);
    const domain = url.origin;
    const robots = `User-agent: *
Allow: /
Sitemap: ${domain}/sitemap.xml`;
    return c.text(robots);
  }
};
