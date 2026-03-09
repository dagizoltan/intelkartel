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
              <li>
                <a href="/" class={isActive('/') && currentPath === '/' ? 'active' : ''}>
                  <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                  Home
                </a>
              </li>
              <li>
                <a href="/blog" class={isActive('/blog') ? 'active' : ''}>
                  <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                  Intel
                </a>
              </li>
              <li>
                <a href="/media" class={isActive('/media') ? 'active' : ''}>
                  <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1.99 6c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-7 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-3.8c-1.01.62-2.3 1.01-3.67 1.01s-2.66-.39-3.67-1.01l1.55-2.68c.67.24 1.38.38 2.12.38s1.45-.14 2.12-.38l1.55 2.68z"/></svg>
                  Media
                </a>
              </li>
              <li>
                <a href="/about" class={isActive('/about') ? 'active' : ''}>
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  About
                </a>
              </li>
              <li>
                <a href="/contact" class={isActive('/contact') ? 'active' : ''}>
                  <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  Contact
                </a>
              </li>
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
              <li><a href="/media">Media</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/careers">Careers</a></li>
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
