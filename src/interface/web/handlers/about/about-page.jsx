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

      <section class="about-intro">
        <div class="container">
          {t.intro_image && (
            <div class="intro-image-container" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <img src={t.intro_image} alt="About IntelKartel" style={{ maxWidth: '100%', height: 'auto', border: '1px solid var(--border-color)' }} />
            </div>
          )}
        </div>
      </section>

      <section class="profiles-section">
        <div class="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {t.profiles && t.profiles.map((profile, index) => (
            <div key={index} class="profile-card">
              <h2 style={{ marginBottom: '0.5rem' }}>{profile.name}</h2>
              {profile.title && <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>{profile.title}</h4>}
              <div class="profile-bio">
                {profile.bio && profile.bio.map((p, pIndex) => (
                  <p key={pIndex} style={{ textAlign: 'justify' }}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Gallery gallery={t.gallery} />

      {t.cta_section && (
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
      )}
    </>
  );
};
