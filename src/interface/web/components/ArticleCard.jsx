export const ArticleCard = ({ article, showImage = true }) => {
  return (
    <article class="article-card">
      {showImage && article.image && (
        <a href={`/blog/${article.slug}`} class="article-image-link">
          <img src={article.image} alt={article.title} loading="lazy" />
        </a>
      )}
      <div class="article-content">
        <h2>
          <a href={`/blog/${article.slug}`}>{article.title}</a>
        </h2>

        <p>{article.description}</p>

        <div class="article-footer">
          <div class="meta">
            <span class="date">{article.datePublished}</span>
            {article.tags && article.tags.length > 0 && (
              <div class="tags" style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
                {article.tags.map(tag => (
                  <a href={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`} class="tag">
                    #{tag}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href={`/blog/${article.slug}`} class="btn btn-sm">Read Intel</a>
        </div>
      </div>
    </article>
  );
};
