import { ArticleCard } from "../../components/ArticleCard.jsx";

export const BlogPage = ({ articles }) => (
  <div class="container">
    <h1>Intel Stream</h1>
    <div class="articles-list">
      {articles.map(article => <ArticleCard article={article} />)}
    </div>
  </div>
);
