export const Hero = ({ title, subtitle, description, short_summary, summary, buttons, imageUrl }) => {
  let shortDesc = short_summary;
  let longDesc = summary;

  if (!shortDesc && description) {
    shortDesc = description.length > 150 ? description.substring(0, 150) + "..." : description;
  }

  if (!longDesc && description) {
    longDesc = description.length > 300 ? description.substring(0, 300) + "..." : description;
  }

  return (
    <section class="hero">
      <div class="container hero-container-flex">
        <div class="hero-content">
          <h1>{title}</h1>
          {subtitle && <h2>{subtitle}</h2>}

          {(shortDesc || longDesc) && (
            <>
              <div class="hero-desc mobile-only">
                 <p style={{ whiteSpace: 'pre-line' }}>{shortDesc}</p>
              </div>
              <div class="hero-desc desktop-only">
                 <p style={{ whiteSpace: 'pre-line' }}>{longDesc}</p>
              </div>
            </>
          )}

          <div class="btn-group">
            {buttons && buttons.map(btn => (
              <a href={btn.link} class={`btn ${btn.type === 'secondary' ? 'secondary' : ''}`}>{btn.text}</a>
            ))}
          </div>
        </div>
        {imageUrl && (
          <div class="hero-image desktop-only">
            <img
              src={imageUrl}
              alt=""
              style={{
                maxHeight: '350px',
                width: 'auto',
                filter: 'invert(1) sepia(1) saturate(5) hue-rotate(50deg)',
                mixBlendMode: 'screen'
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};
