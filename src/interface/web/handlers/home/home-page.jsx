import { ArticleCard } from "../../components/ArticleCard.jsx";
import { Hero } from "../../components/Hero.jsx";

export const HomePage = ({ articles, topTags, t }) => (
  <>
    <Hero
        title={t?.hero?.title}
        subtitle={t?.hero?.subtitle}
        short_summary={t?.hero?.short_summary}
        summary={t?.hero?.summary}
        buttons={t?.hero?.buttons}
    />

    <section>
        <div class="container">
            <h2>Latest Intelligence</h2>
            <div class="articles-list">
                {articles.map(article => <ArticleCard article={article} showImage={false} />)}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a href="/blog" class="btn secondary">View All Intel</a>
            </div>
        </div>
    </section>

    {topTags && topTags.length > 0 && (
      <section style="background: var(--secondary-bg); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
        <div class="container">
          <h2 style="text-align: center; margin-bottom: 2rem;">Common Sections</h2>
          <div class="tags-cloud" style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; padding: 1rem 0;">
            {topTags.map(tag => (
              <a href={`/blog/tags/${encodeURIComponent(tag.name.toLowerCase())}`} class="tag" style="padding: 0.8rem 1.5rem; font-size: 1.1rem;">
                {tag.name} <span style="font-size: 0.9rem; color: var(--muted-text-color);">({tag.count})</span>
              </a>
            ))}
          </div>
          <div style="margin-top: 2rem; text-align: center;">
            <a href="/blog/tags" class="btn btn-sm secondary">Browse All Tags</a>
          </div>
        </div>
      </section>
    )}

    {t.cta_section && (
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
