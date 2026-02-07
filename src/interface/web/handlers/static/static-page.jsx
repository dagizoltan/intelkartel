export const StaticPage = ({ content }) => (
  <div class="container article-container">
    <div class="article-body" dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);
