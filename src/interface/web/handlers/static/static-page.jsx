export const StaticPage = ({ content }) => (
  <section>
    <div class="container article-container">
      <div class="article-body" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  </section>
);
