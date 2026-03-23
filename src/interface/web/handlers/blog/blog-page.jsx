import { ArticleCard } from "../../components/ArticleCard.jsx";
import { Hero } from "../../components/Hero.jsx";

export const BlogPage = ({ articles, topTags, t }) => (
  <>
    <Hero
        title={t?.hero?.title}
        subtitle={t?.hero?.subtitle}
        short_summary={t?.hero?.short_summary}
        summary={t?.hero?.summary}
        buttons={t?.hero?.buttons}
    />

    {topTags && topTags.length > 0 && (
      <section style="background: var(--secondary-bg); border-top: 1px solid var(--primary-color); border-bottom: 1px solid var(--primary-color); padding: 1.5rem 0;">
        <div class="container">
          <h2 style="font-size: 0.8rem; margin-bottom: 1rem; text-transform: uppercase; opacity: 0.7; letter-spacing: 2px; color: var(--primary-color);">[ Top Intelligence Topics ]</h2>
          <div class="tags-cloud" style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            {topTags.map(tag => (
              <a href={`/blog/tags/${encodeURIComponent(tag.name.toLowerCase())}`} class="tag" style="padding: 6px 14px; font-size: 0.8rem; font-family: 'Space Mono', monospace; border-radius: 0; background: rgba(180, 251, 81, 0.05);">
                #{tag.name.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </section>
    )}

    <section>
        <div class="container">
            <div style="margin-bottom: 2rem; display: flex; justify-content: flex-end;">
                <a href="/blog/tags" class="btn btn-secondary" style="font-size: 0.9rem;">Browse by Tag</a>
            </div>
            <div class="articles-list">
                {articles.map(article => <ArticleCard article={article} showImage={false} />)}
            </div>
        </div>
    </section>
  </>
);
