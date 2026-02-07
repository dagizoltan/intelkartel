import { Map } from "../../components/Map.jsx";
import { Hero } from "../../components/Hero.jsx";
import { Gallery } from "../../components/Gallery.jsx";

export const HomePage = ({ t }) => {
  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFD700" width="16" height="16">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  );

  return (
    <>
      <Hero
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        short_summary={t.hero.short_summary}
        summary={t.hero.summary}
        buttons={t.hero.buttons}
      />

      <section class="features" style={{ textAlign: 'center' }}>
        <div class="container">
          <h2>{t.features.title}</h2>
          <p>{t.features.description}</p>
          <div class="features-grid">
            {t.features.items.map(feature => (
              <div class="feature">
                {feature.image && (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: 'var(--border-radius)',
                      marginBottom: '1rem'
                    }}
                  />
                )}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="about" style={{ backgroundColor: 'var(--secondary-bg)' }}>
        <div class="container">
          <h2>{t.about.title}</h2>
          <h3>{t.about.subtitle}</h3>
          <p>{t.about.text}</p>
          {t.about.link && (
             <div style={{ marginTop: '1rem' }}>
              <a href={t.about.link} class="btn">{t.about.link_text}</a>
             </div>
          )}
        </div>
      </section>

      {t.testimonial && (
        <section class="testimonials-section">
          <div class="container">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{t.testimonial.title}</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}
            >
              {t.testimonial.items.map(item => (
                <div
                  class="testimonial-item"
                  style={{
                    backgroundColor: 'var(--secondary-bg)',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--box-shadow-hover)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Stars */}
                    <div style={{ marginBottom: '1rem', color: '#FFD700', display: 'flex', gap: '2px' }}>
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                    <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>"{item.quote}"</p>
                  </div>
                  <h4 style={{ color: 'var(--primary-color)', textAlign: 'right', marginTop: 'auto' }}>- {item.author}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {t.location && (
        <Map
          title={t.location.title}
          address={t.location.address}
          buttonText={t.location.get_directions}
        />
      )}

      {t.faq && t.faq.items && t.faq.items.length > 0 && (
        <section class="faq-section">
          <div class="container">
            <h2>{t.faq.title}</h2>
            <div class="faq-grid">
              {t.faq.items.map(item => (
                <div class="faq-item">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
