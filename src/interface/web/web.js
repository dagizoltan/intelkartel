import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { contextMiddleware } from "./middleware/context.js";
import { rendererMiddleware } from "./middleware/renderer.js";
import { homeHandler } from "./handlers/home/home-handler.js";
import { blogHandler } from "./handlers/blog/blog-handler.js";
import { careersHandler } from "./handlers/careers/careers-handler.js";
import { aboutHandler } from "./handlers/about/about-handler.js";
import { contactHandler } from "./handlers/contact/contact-handler.js";
import { staticHandler } from "./handlers/static/static-handler.js";
import { sitemapHandler } from "./handlers/sitemap/sitemap-handler.js";
import { robotsHandler } from "./handlers/robots/robots-handler.js";
import { mediaHandler } from "./handlers/media/media-handler.js";
import { s3ProxyHandler } from "./handlers/media/s3ProxyHandler.js";


const web = new Hono();

// Middleware
web.use('*', contextMiddleware);
web.use('*', rendererMiddleware);

// Static files
web.get('/static/media/*', s3ProxyHandler);
web.get('/static/*', serveStatic({ root: './src/interface/web' }));
web.get('/data/music/*', serveStatic({ root: './' }));

// Islands/Web Components attached explicitly
web.get('/islands/custom-audio-player.js', serveStatic({ path: './src/interface/web/handlers/media/custom-audio-player.js' }));

// Sitemap & Robots
web.get('/sitemap.xml', sitemapHandler.get);
web.get('/robots.txt', robotsHandler.get);

// Routes
web.get('/', homeHandler.get);
web.get('/blog', blogHandler.index);
web.get('/blog/tags', blogHandler.tags);
web.get('/blog/tags/:tag', blogHandler.tagDetail);
web.get('/blog/:slug', blogHandler.detail);
web.get('/careers', careersHandler.index);
web.get('/about', aboutHandler.get);
web.get('/contact', contactHandler.get);

// Media routes
web.get('/media', mediaHandler.index);
web.get('/media/gallery', mediaHandler.gallery);
web.get('/media/audio', mediaHandler.audio);
web.get('/media/pdf', mediaHandler.pdf);

// Start server
const port = parseInt(Deno.env.get("PORT")) || 8000;
Deno.serve({ port, hostname: "0.0.0.0" }, web.fetch);
