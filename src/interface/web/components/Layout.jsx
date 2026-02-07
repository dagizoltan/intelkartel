import { raw } from 'hono/html';

const SeoHead = ({ seo }) => {
  if (!seo) return null;

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      {seo.image && <meta property="og:image" content={seo.image} />}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      {seo.type && <meta property="og:type" content={seo.type} />}
      {seo.jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: raw(JSON.stringify(seo.jsonLd)) }} />}
    </>
  );
};

export const Layout = ({ children, currentPath, seo }) => {
  const isActive = (path) => currentPath === path || (path !== '/' && currentPath.startsWith(path));

  const fallbackSeo = {
    title: 'IntelKartel',
    description: 'IntelKartel - Editorial & Thought Leadership',
  };

  const effectiveSeo = seo || fallbackSeo;

  return (
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <SeoHead seo={effectiveSeo} />
      <link rel="stylesheet" href="/static/styles.css" />
    </head>
    <body>
      <header class="site-header">
        <div class="header-container">
          <div class="brand">
            <a href="/">IntelKartel</a>
          </div>

          <nav class="main-nav">
            <ul>
              <li><a href="/" class={isActive('/') && currentPath === '/' ? 'active' : ''}>Home</a></li>
              <li><a href="/blog" class={isActive('/blog') ? 'active' : ''}>Intel</a></li>
              <li><a href="/about" class={isActive('/about') ? 'active' : ''}>About</a></li>
              <li><a href="/contact" class={isActive('/contact') ? 'active' : ''}>Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main-content">
        {children}
      </main>
      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-col brand-col">
            <h3>IntelKartel</h3>
            <p>Editorial & Thought Leadership.</p>
          </div>
          <div class="footer-col nav-col">
            <h3>Navigation</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/blog">Intel</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col contact-col">
            <h3>Contact</h3>
            <p><a href="mailto:contact@intelkartel.com">contact@intelkartel.com</a></p>
          </div>
        </div>
      </footer>
    </body>
    </html>
  );
};
