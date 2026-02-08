import { Hero } from "./Hero.jsx";

export const ArticleView = ({ article, content, t }) => {
  return (
    <>
      <Hero
        title={article.title}
        subtitle={article.datePublished}
        summary={article.description}
      />

      <section class="container article-container">
        {article.author && <div class="meta" style={{ color: 'var(--muted-text-color)', marginBottom: '1rem' }}>By: {article.author}</div>}
        <div class="article-body" dangerouslySetInnerHTML={{ __html: content }} />

        <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <a href="/blog" class="btn secondary">&lt; Back to Intel</a>
        </footer>
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
