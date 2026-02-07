import { ArticleCard } from "../../components/ArticleCard.jsx";

export const HomePage = ({ articles }) => (
  <div>
    <section class="hero">
      <div class="container">
        <h1>IntelKartel</h1>
        <h2>The Intelligence Cartel</h2>
        <p>Unfiltered analysis. Core interest defense. Global perspective.</p>
        <div class="btn-group">
            <a href="/blog" class="btn">Latest Intel</a>
        </div>
      </div>
    </section>

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
