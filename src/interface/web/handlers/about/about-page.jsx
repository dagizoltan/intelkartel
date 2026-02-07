import { Hero } from "../../components/Hero.jsx";
import { Gallery } from "../../components/Gallery.jsx";

export const AboutPage = ({ t }) => {
  return (
    <>
      <Hero
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        short_summary={t.hero.short_summary}
        summary={t.hero.summary}
        buttons={t.hero.buttons}
      />

      <section>
        <div class="container">
          {t.content.map(p => <p>{p}</p>)}
        </div>
      </section>

      <section>
        <div class="container">
          <h2>{t.spirit.title}</h2>
          <h3>{t.spirit.subtitle}</h3>
          {t.spirit.text.map(p => <p>{p}</p>)}
        </div>
      </section>

      <section>
        <div class="container">
          <h2>{t.discover.title}</h2>
          <p>{t.discover.text}</p>
        </div>
      </section>

      <Gallery gallery={t.gallery} />

      <section class="cta-section">
        <div class="container">
          <h2>{t.cta_section.title}</h2>
          <p>{t.cta_section.text}</p>
          <div class="btn-group">
            {t.cta_section.buttons ? t.cta_section.buttons.map(btn => (
              <a href={btn.link} class={`btn ${btn.type === 'secondary' ? 'secondary' : ''}`}>{btn.text}</a>
            )) : ''}
          </div>
        </div>
      </section>
    </>
  );
};
