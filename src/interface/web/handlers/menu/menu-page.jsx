import { Hero } from "../../components/Hero.jsx";
import { html } from "hono/html";
import { Gallery } from "../../components/Gallery.jsx";

export const MenuPage = ({ t }) => {
  // Collect all images from all sections
  const allImages = [];
  t.sections.forEach((section, sIndex) => {
    section.items.forEach((item, iIndex) => {
      if (item.image) {
        allImages.push({
          src: item.image,
          alt: item.name
        });
      }
    });
  });

  // Split into top and bottom grids (4 images each)
  const topImages = allImages.slice(0, 4);
  const bottomImages = allImages.slice(4, 8);

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
          {/* Top Grid (Desktop Only via CSS) */}
          {topImages.length > 0 && (
            <div class="hero-grid">
              {topImages.map((img, index) => (
                <div class="menu-image-container" key={`top-${index}`}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    class="menu-image"
                    loading="lazy"
                    width="400"
                    height="400"
                  />
                </div>
              ))}
            </div>
          )}

          <div class="menu-sections">
            {t.sections.map((section, sectionIndex) => (
              <div class="menu-section">
                <h2>{section.title}</h2>
                <div class="menu-group-layout">
                  {/* Right Column: Items List */}
                  <ul class="menu-items-list">
                    {section.items.map((item, itemIndex) => (
                      <li
                        class="menu-item"
                        data-id={`item-${sectionIndex}-${itemIndex}`}
                      >
                        <div class="item-header">
                          <span class="item-name">{item.name}</span>
                          <span class="item-price">{item.price}</span>
                        </div>
                        {item.description && <p class="item-description">{item.description}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Grid (Desktop Only via CSS) */}
          {bottomImages.length > 0 && (
            <div class="hero-grid bottom">
              {bottomImages.map((img, index) => (
                <div class="menu-image-container" key={`bottom-${index}`}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    class="menu-image"
                    loading="lazy"
                    width="400"
                    height="400"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Removed <Gallery gallery={t.gallery} /> as requested */}

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
