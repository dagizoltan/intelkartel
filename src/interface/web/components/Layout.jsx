import { raw } from 'hono/html';

const SeoHead = ({ seo, lang, currentPath }) => {
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

export const Layout = ({ children, title, t, lang, currentPath, seo, preloadImage }) => {

  const getAltLangPath = (targetLang) => {
    if (!currentPath) return `/${targetLang}`;
    const parts = currentPath.split('/');
    if (parts.length < 2) return `/${targetLang}`;
    parts[1] = targetLang;
    return parts.join('/');
  };

  const icons = {
    home: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
    about: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
    menu: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>,
    contact: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
  };

  const socialIcons = {
    facebook: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.01 3.69 9.15 8.5 9.88v-6.99H7.9V12h2.6v-2.27c0-2.57 1.54-3.99 3.87-3.99 1.12 0 2.28.2 2.28.2v2.51h-1.28c-1.28 0-1.67.79-1.67 1.61V12h2.82l-.45 2.89h-2.37v6.99C18.31 21.15 22 17.01 22 12c0-5.52-4.48-10-10-10z"/></svg>,
    instagram: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>,
    twitter: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
  };

  const isActive = (path) => currentPath === path;

  // Fallback for transition
  const fallbackSeo = {
    title: t?.meta?.title || title || 'Zümmögő',
    description: t?.meta?.description || 'Zümmögő - Bakery & Cafe',
    keywords: t?.meta?.keywords,
    jsonLd: t?.jsonld
  };

  const effectiveSeo = seo || fallbackSeo;

  return (
    <html lang={lang}>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="twitter:card" content="summary_large_image" />
      {preloadImage && <link rel="preload" as="image" href={preloadImage} />}
      <SeoHead seo={effectiveSeo} />
      <link rel="alternate" hreflang="en" href={getAltLangPath('en')} />
      <link rel="alternate" hreflang="hu" href={getAltLangPath('hu')} />
      <link rel="stylesheet" href="/static/leaflet.css" />
      <script src="/static/leaflet.js"></script>
      <link rel="stylesheet" href="/static/styles.css" />
    </head>
    <body>
      <header class="site-header">
        <div class="header-container">
          <div class="brand">
            <a href={`/${lang}`}>Zümmögő</a>
          </div>

          <div class="language-picker">
            <a href={getAltLangPath('hu')} class={lang === 'hu' ? 'active' : ''}>HU</a>
            <a href={getAltLangPath('en')} class={lang === 'en' ? 'active' : ''}>EN</a>
          </div>

          <nav class="main-nav">
            <ul>
              <li>
                <a href={`/${lang}`} class={isActive(`/${lang}`) ? 'active' : ''}>
                  {icons.home}
                  <span>{t && t.nav ? t.nav.home : 'Home'}</span>
                </a>
              </li>
              <li>
                <a href={`/${lang}/menu`} class={isActive(`/${lang}/menu`) ? 'active' : ''}>
                  {icons.menu}
                  <span>{t && t.nav ? t.nav.menu : 'Menu'}</span>
                </a>
              </li>
              <li>
                <a href={`/${lang}/about`} class={isActive(`/${lang}/about`) ? 'active' : ''}>
                  {icons.about}
                  <span>{t && t.nav ? t.nav.about : 'About'}</span>
                </a>
              </li>
              <li>
                <a href={`/${lang}/contact`} class={isActive(`/${lang}/contact`) ? 'active' : ''}>
                  {icons.contact}
                  <span>{t && t.nav ? t.nav.contact : 'Contact'}</span>
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
            <h3>Zümmögő</h3>
            <p>{t && t.meta && t.meta.description ? t.meta.description : 'Zümmögő - Bakery & Cafe'}</p>
          </div>
          <div class="footer-col nav-col">
            <h3>Navigation</h3>
            <ul>
              <li><a href={`/${lang}`}>{t && t.nav ? t.nav.home : 'Home'}</a></li>
              <li><a href={`/${lang}/menu`}>{t && t.nav ? t.nav.menu : 'Menu'}</a></li>
              <li><a href={`/${lang}/about`}>{t && t.nav ? t.nav.about : 'About'}</a></li>
              <li><a href={`/${lang}/contact`}>{t && t.nav ? t.nav.contact : 'Contact'}</a></li>
            </ul>
          </div>
          <div class="footer-col contact-col">
            <h3>Contact</h3>
            <p>Zümmögő pékség & kávézó</p>
            <p><a href="tel:+36308125425">+36 30 812 5425</a></p>
            <p><a href="mailto:info@zummogo.hu">info@zummogo.hu</a></p>
          </div>
          <div class="footer-col social-col">
            <h3>Follow Us</h3>
            <div class="social-links">
              <a href="#" aria-label="Visit Zümmögő on Facebook">{socialIcons.facebook}</a>
              <a href="#" aria-label="Visit Zümmögő on Instagram">{socialIcons.instagram}</a>
              <a href="#" aria-label="Visit Zümmögő on Twitter">{socialIcons.twitter}</a>
            </div>
          </div>
        </div>
      </footer>
    </body>
    </html>
  );
};
