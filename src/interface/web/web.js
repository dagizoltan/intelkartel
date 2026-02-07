import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { contextMiddleware } from "./middleware/context.js";
import { rendererMiddleware } from "./middleware/renderer.js";
import { homeHandler } from "./handlers/home/home-handler.js";
import { aboutHandler } from "./handlers/about/about-handler.js";
import { contactHandler } from "./handlers/contact/contact-handler.js";
import { menuHandler } from "./handlers/menu/menu-handler.js";
import { sitemapHandler } from "./handlers/sitemap/sitemap-handler.js";
import { robotsHandler } from "./handlers/robots/robots-handler.js";

const web = new Hono();

// Middleware
web.use('*', contextMiddleware);
web.use('*', rendererMiddleware);

// Serve specific islands directly from source
web.get('/static/js/tito-map.js', serveStatic({ path: './src/interface/web/components/islands/tito-map.js' }));
web.get('/static/js/menu-interaction.js', serveStatic({ path: './src/interface/web/handlers/menu/islands/menu-interaction.js' }));

// Static files
// Serve /static/* from ./src/interface/web
web.get('/static/*', serveStatic({ root: './src/interface/web' }));

// Redirect root to /hu
web.get('/', (c) => c.redirect('/hu'));

// Sitemap & Robots
web.get('/sitemap.xml', sitemapHandler.get);
web.get('/robots.txt', robotsHandler.get);

// Routes
web.get('/:lang', homeHandler.get);
web.get('/:lang/about', aboutHandler.get);
web.get('/:lang/contact', contactHandler.get);
web.get('/:lang/menu', menuHandler.get);

// Start server
Deno.serve({ port: 8000 }, web.fetch);
