export const ArticleCard = ({ article }) => {
  return (
    <article class="article-card" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
      {article.image && (
        <a href={`/blog/${article.slug}`} class="article-image-link" style={{ display: 'block', marginBottom: '1rem' }}>
          <img src={article.image} alt={article.title} loading="lazy" style={{ maxWidth: '100%', height: 'auto', border: '1px solid var(--border-color)' }} />
        </a>
      )}
      <div class="article-content">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          <a href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>{article.title}</a>
        </h2>
        <div class="meta" style={{ color: 'var(--muted-text-color)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <span class="date">{article.datePublished}</span>
        </div>
        <p style={{ marginBottom: '1rem' }}>{article.description}</p>
        <a href={`/blog/${article.slug}`} class="btn">Read Protocol</a>
      </div>
    </article>
  );
};
