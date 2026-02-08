import { ArticleCard } from "../../components/ArticleCard.jsx";
import { Hero } from "../../components/Hero.jsx";

export const HomePage = ({ articles, t }) => (
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
                {articles.map(article => <ArticleCard article={article} />)}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a href="/blog" class="btn secondary">View All Intel</a>
            </div>
        </div>
    </section>

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
