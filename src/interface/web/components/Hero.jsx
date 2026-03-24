export const Hero = ({ title, subtitle, description, short_summary, summary, buttons, imageUrl = "/static/images/intelkarteldance.gif" }) => {
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
      <style>{`
        .hero-image img {
          animation: image-glitch 4s step-end infinite;
        }
        @keyframes image-glitch {
          0% { transform: translate(0); clip-path: inset(0 0 0 0); }
          2% { transform: translate(-5px, 2px); clip-path: inset(10% 0 80% 0); }
          4% { transform: translate(5px, -2px); clip-path: inset(50% 0 30% 0); }
          6% { transform: translate(0); clip-path: inset(0 0 0 0); }
          50% { transform: translate(-2px, 1px); clip-path: inset(80% 0 10% 0); }
          52% { transform: translate(2px, -1px); clip-path: inset(20% 0 70% 0); }
          54% { transform: translate(0); clip-path: inset(0 0 0 0); }
        }
      `}</style>
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
            <img src={imageUrl} alt="" style="max-height: 350px; width: auto; mix-blend-mode: screen;" />
          </div>
        )}
      </div>
    </section>
  );
};
