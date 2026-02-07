import { Map } from "../../components/Map.jsx";
import { Hero } from "../../components/Hero.jsx";
import { Gallery } from "../../components/Gallery.jsx";

export const ContactPage = ({ t }) => {
  const icons = {
    phone: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>,
    email: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
    address: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
  };

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
          <h2>{t.get_in_touch.title}</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{t.get_in_touch.text}</p>
        </div>
      </section>

      <section class="contact-details">
        <div class="container contact-grid">
          <div class="contact-card">
            <div class="icon">{icons.phone}</div>
            <h3>{t.phone.label}</h3>
            <p><a href={`tel:${t.phone.value.replace(/\s/g, '')}`}>{t.phone.value}</a></p>
          </div>
          <div class="contact-card">
            <div class="icon">{icons.email}</div>
            <h3>{t.email.label}</h3>
            <p><a href={`mailto:${t.email.value}`}>{t.email.value}</a></p>
          </div>
          <div class="contact-card">
            <div class="icon">{icons.address}</div>
            <h3>{t.address.label}</h3>
            <p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.address.value)}`} target="_blank">{t.address.value}</a></p>
          </div>
        </div>
      </section>

      <Map
        buttonText={t.get_directions}
      />

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
