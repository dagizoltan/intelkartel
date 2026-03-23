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
      <section style="background: var(--bg-color); border: none; padding: 2rem 0;">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <h2 style="font-size: 0.8rem; margin: 0; text-transform: uppercase; opacity: 0.7; letter-spacing: 2px; color: var(--primary-color);">[ Top Intelligence Topics ]</h2>
            <a href="/blog/tags" class="btn btn-sm secondary" style="font-size: 0.75rem; width: auto; margin: 0;">Browse All Tags</a>
          </div>
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
            <div class="articles-list">
                {articles.map(article => <ArticleCard article={article} showImage={false} />)}
            </div>
        </div>
    </section>
  </>
);
