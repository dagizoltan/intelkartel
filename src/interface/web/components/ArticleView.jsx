export const ArticleView = ({ article, content }) => {
  return (
    <div class="container article-container">
        <header class="article-header" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h1 style={{ fontSize: '2.5rem', wordBreak: 'break-word' }}>{article.title}</h1>
            <div class="meta" style={{ color: 'var(--muted-text-color)' }}>
                <span class="date">Published: {article.datePublished}</span>
                {article.author && <span class="author"> | By: {article.author}</span>}
            </div>
        </header>

        <div class="article-body" dangerouslySetInnerHTML={{ __html: content }} />

        <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <a href="/blog" class="btn secondary">&lt; Back to Intel</a>
        </footer>
    </div>
  );
};
