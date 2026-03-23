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
        <div class="meta">
          <span class="date">{article.datePublished}</span>
          {article.tags && article.tags.length > 0 && (
            <div class="tags" style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
              {article.tags.map(tag => (
                <a href={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`} style="font-size: 0.75rem; color: #666; background: #f0f0f0; padding: 2px 8px; border-radius: 4px; text-decoration: none;">
                  #{tag}
                </a>
              ))}
            </div>
          )}
        </div>
        <p>{article.description}</p>
        <a href={`/blog/${article.slug}`} class="btn">Read Intel</a>
      </div>
    </article>
  );
};
