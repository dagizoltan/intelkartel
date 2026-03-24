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
            <div class="social-links">
              <a href="#" aria-label="Twitter">
                <svg class="social-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg class="social-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>
              </a>
            </div>
          </div>
          <div class="footer-col nav-col">
            <h3>Navigation</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col media-col">
            <h3>Library</h3>
            <ul>
              <li><a href="/media/gallery">Visual Intel</a></li>
              <li><a href="/media/audio">Audio Intercepts</a></li>
              <li><a href="/media/pdf">Intelligence Library</a></li>
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
