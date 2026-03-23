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

      <Gallery gallery={t.gallery} />

      <section class="faq-section">
        <style>{`
          .faq-section {
            background-color: var(--secondary-bg);
          }
          .faq-grid {
            display: grid;
            gap: 2rem;
            max-width: 800px;
            margin: 0 auto;
          }
          .faq-item h3 {
            color: var(--primary-color);
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .faq-item h3::before {
            content: "[Q]";
            font-size: 0.8rem;
            opacity: 0.7;
          }
          .faq-item p {
            margin: 0;
            font-size: 0.95rem;
            line-height: 1.6;
          }
        `}</style>
        <div class="container">
          <h2 style="margin-bottom: 3rem;">Operational FAQ</h2>
          <div class="faq-grid" style="margin: 0;">
            <div class="faq-item">
              <h3>Is this a real intelligence agency?</h3>
              <p>We are as real as the surveillance state you ignore every day. Our "agency" operates on the fringes of dark humor and actual open-source data. If you have to ask, you're already on a list.</p>
            </div>
            <div class="faq-item">
              <h3>Can I join IntelKartel?</h3>
              <p>We don't hire; we recruit via cryptic messages in your browser's console. If you can read this, you're either a developer or a very persistent ghost. Both are acceptable.</p>
            </div>
            <div class="faq-item">
              <h3>Where is your headquarters?</h3>
              <p>In a non-descript server rack in a country that doesn't respect extradition treaties. Or possibly in a basement. The geometry of our location is non-Euclidean.</p>
            </div>
            <div class="faq-item">
              <h3>Are my communications secure?</h3>
              <p>Our encryption is so advanced even we can't read what you send. Unless you use a weak password. Then even the neighbors' cat knows your secrets.</p>
            </div>
            <div class="faq-item">
              <h3>How can I leak intelligence?</h3>
              <p>Use the dead-drop locations provided in our "Visual Intel" section or send an encrypted burst transmission to our primary email. Do not use carrier pigeons; they have been compromised by the alphabet agencies.</p>
            </div>
            <div class="faq-item">
              <h3>What is your stance on privacy?</h3>
              <p>Privacy is an antique concept. We prefer the term "selective transparency." You tell us everything, and we decide what the public needs to know. It's much more efficient.</p>
            </div>
            <div class="faq-item">
              <h3>Who funds IntelKartel?</h3>
              <p>Mainly through the sale of redacted government documents and a very lucrative lemonade stand in the Cayman Islands. We also accept Monero and high-quality memes as payment.</p>
            </div>
            <div class="faq-item">
              <h3>Can I get a physical copy of the library?</h3>
              <p>Our library exists primarily in the ethereal realm of the internet. Physical copies are only available via microfiche hidden inside hollowed-out copies of "The Art of War" in select libraries worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="container">
          <h2>{t.cta_section.title}</h2>
          {t.cta_section.subtitle && <h3 style="color: var(--bg-color); margin-top: -1rem; margin-bottom: 1rem; opacity: 0.8; font-size: 1.2rem;">{t.cta_section.subtitle}</h3>}
          {t.cta_section.description && <p style="font-size: 1.1rem; margin-bottom: 2rem; max-width: 600px;">{t.cta_section.description}</p>}
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
