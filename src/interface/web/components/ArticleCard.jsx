export const ArticleCard = ({ article }) => {
  return (
    <article class="article-card">
      {article.image && (
        <a href={`/blog/${article.slug}`} class="article-image-link">
          <img src={article.image} alt={article.title} loading="lazy" />
        </a>
      )}
      <div class="article-content">
        <h2>
          <a href={`/blog/${article.slug}`}>{article.title}</a>
        </h2>
        <div class="meta">
          <span class="date">{article.datePublished}</span>
        </div>
        <p>{article.description}</p>
        <a href={`/blog/${article.slug}`} class="btn">Read Intel</a>
      </div>
    </article>
  );
};
