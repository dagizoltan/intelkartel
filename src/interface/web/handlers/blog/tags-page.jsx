import { Hero } from "../../components/Hero.jsx";

export const TagsPage = ({ tags, t }) => (
  <>
    <Hero
        title={t?.tags?.title || "Intel Tags"}
        subtitle={t?.tags?.subtitle || "Browse by topic"}
        short_summary={t?.tags?.short_summary}
        summary={t?.tags?.summary}
    />
    <section>
        <div class="container">
            <div class="tags-cloud" style="display: flex; flex-wrap: wrap; gap: 1rem; padding: 2rem 0;">
                {tags.map(tag => (
                    <a href={`/blog/tags/${encodeURIComponent(tag.name.toLowerCase())}`} class="tag-item" style="padding: 0.5rem 1rem; background: #eee; border-radius: 4px; text-decoration: none; color: #333;">
                        {tag.name} <span style="font-size: 0.8rem; color: #666;">({tag.count})</span>
                    </a>
                ))}
            </div>
        </div>
    </section>
  </>
);
