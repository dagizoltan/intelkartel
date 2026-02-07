import { ArticleCard } from "../../components/ArticleCard.jsx";
import { parse } from "@std/yaml";

const ARTICLES_DIR = "data/dict/articles";

const getLatestArticles = async (limit = 5) => {
  const entries = [];
  try {
    for await (const entry of Deno.readDir(ARTICLES_DIR)) {
      if (entry.isDirectory) {
        try {
          const yamlContent = await Deno.readTextFile(`${ARTICLES_DIR}/${entry.name}/index.yaml`);
          const meta = parse(yamlContent);
          entries.push(meta);
        } catch (e) {}
      }
    }
  } catch (e) {}
  return entries.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished)).slice(0, limit);
};

export const homeHandler = {
  get: async (c) => {
    const articles = await getLatestArticles(5);
    const seo = {
      title: "IntelKartel - The Intelligence Cartel",
      description: "Editorial and thought leadership from the front lines.",
      canonical: "https://intelkartel.com/"
    };

    const HomePage = () => (
      <div>
        <section class="hero">
          <div class="container">
            <h1>IntelKartel</h1>
            <h2>The Intelligence Cartel</h2>
            <p>Unfiltered analysis. Core interest defense. Global perspective.</p>
            <div class="btn-group">
                <a href="/blog" class="btn">Latest Intel</a>
            </div>
          </div>
        </section>

        <section class="container">
            <h2>Latest Intelligence</h2>
            <div class="articles-list">
                {articles.map(article => <ArticleCard article={article} />)}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a href="/blog" class="btn secondary">View All Intel</a>
            </div>
        </section>
      </div>
    );

    return c.render(HomePage, { seo });
  }
};
