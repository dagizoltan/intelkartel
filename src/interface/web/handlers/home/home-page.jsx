import { ArticleCard } from "../../components/ArticleCard.jsx";
import { Hero } from "../../components/Hero.jsx";

export const HomePage = ({ articles, t }) => (
  <div>
    <Hero
        title={t?.hero?.title}
        subtitle={t?.hero?.subtitle}
        short_summary={t?.hero?.short_summary}
        summary={t?.hero?.summary}
        buttons={t?.hero?.buttons}
    />

    <section class="container">
        <h2>Latest Intelligence</h2>
        <div class="articles-list">
            {articles.map(article => <ArticleCard article={article} />)}
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href="/blog" class="btn secondary">View All Intel</a>
        </div>
    </section>
  </div>
);
