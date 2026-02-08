import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { contextMiddleware } from "./middleware/context.js";
import { rendererMiddleware } from "./middleware/renderer.js";
import { homeHandler } from "./handlers/home/home-handler.js";
import { blogHandler } from "./handlers/blog/blog-handler.js";
import { careersHandler } from "./handlers/careers/careers-handler.js";
import { staticHandler } from "./handlers/static/static-handler.js";
import { sitemapHandler } from "./handlers/sitemap/sitemap-handler.js";
import { robotsHandler } from "./handlers/robots/robots-handler.js";

const web = new Hono();

// Middleware
web.use('*', contextMiddleware);
web.use('*', rendererMiddleware);

// Static files
web.get('/static/*', serveStatic({ root: './src/interface/web' }));

// Sitemap & Robots
web.get('/sitemap.xml', sitemapHandler.get);
web.get('/robots.txt', robotsHandler.get);

// Routes
web.get('/', homeHandler.get);
web.get('/blog', blogHandler.index);
web.get('/blog/:slug', blogHandler.detail);
web.get('/careers', careersHandler.index);
web.get('/about', staticHandler.about);
web.get('/contact', staticHandler.contact);

// Start server
Deno.serve({ port: 8000 }, web.fetch);
