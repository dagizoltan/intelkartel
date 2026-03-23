import { ArticleCard } from "../../components/ArticleCard.jsx";
import { Hero } from "../../components/Hero.jsx";

export const TagDetailPage = ({ tag, articles, t }) => (
  <>
    <Hero
        title={tag}
        subtitle={`${articles.length} reports`}
    />
    <section>
        <div class="container">
            <div class="articles-list">
                {articles.map(article => <ArticleCard article={article} showImage={false} />)}
            </div>
        </div>
    </section>
  </>
);
