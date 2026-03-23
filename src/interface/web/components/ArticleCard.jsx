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

        {article.tags && article.tags.length > 0 && (
          <div class="tags article-tags-list" style="margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
            {article.tags.map(tag => (
              <a href={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`} class="tag">
                #{tag}
              </a>
            ))}
          </div>
        )}

        <div class="desktop-only">
          <p>{article.description}</p>
        </div>

        <div class="article-footer">
          <div class="meta">
            <span class="date">{article.datePublished}</span>
          </div>
          <a href={`/blog/${article.slug}`} class="btn btn-sm">Read Intel</a>
        </div>
      </div>
    </article>
  );
};
