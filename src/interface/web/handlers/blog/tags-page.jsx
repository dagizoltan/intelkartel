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
                    <a href={`/blog/tags/${encodeURIComponent(tag.name.toLowerCase())}`} class="tag" style="padding: 0.5rem 1rem; font-size: 1rem;">
                        {tag.name} <span style="font-size: 0.8rem; color: var(--muted-text-color);">({tag.count})</span>
                    </a>
                ))}
            </div>
        </div>
    </section>
  </>
);
