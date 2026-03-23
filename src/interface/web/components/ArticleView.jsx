import { Hero } from "./Hero.jsx";

export const ArticleView = ({ article, content, t }) => {
  return (
    <>
      <Hero
        title={article.title}
        subtitle={article.datePublished}
        summary={article.description}
      />

      <section>
        <div class="container article-container">
          {article.author && <div class="meta" style={{ color: 'var(--muted-text-color)', marginBottom: '1rem' }}>By: {article.author}</div>}
          <div class="article-body" dangerouslySetInnerHTML={{ __html: content }} />

          {article.tags && article.tags.length > 0 && (
            <div class="article-tags" style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {article.tags.map(tag => (
                <a href={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`} style={{ fontSize: '0.85rem', color: '#666', background: '#f0f0f0', padding: '4px 12px', borderRadius: '4px', textDecoration: 'none' }}>
                  #{tag}
                </a>
              ))}
            </div>
          )}

          <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <a href="/blog" class="btn secondary">&lt; Back to Intel</a>
          </footer>
        </div>
      </section>

      {t && t.cta_section && (
        <section class="cta-section">
          <div class="container">
            <h2>{t.cta_section.title}</h2>
            <p>{t.cta_section.text}</p>
            <div class="btn-group">
              {t.cta_section.buttons ? t.cta_section.buttons.map(btn => (
                <a href={btn.link} class={`btn ${btn.type === 'secondary' ? 'secondary' : ''}`}>{btn.text}</a>
              )) : ''}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
