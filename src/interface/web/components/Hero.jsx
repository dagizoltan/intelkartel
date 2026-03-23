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
        .hero {
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.05) 0px,
            rgba(0, 0, 0, 0.05) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 5;
        }
        .hero-image img {
          max-height: 350px;
          width: auto;
          mix-blend-mode: screen;
          animation: image-glitch 4s step-end infinite;
          position: relative;
        }
        @keyframes image-glitch {
          0% { transform: translate(0); clip-path: inset(0 0 0 0); }
          1% { transform: translate(-5px, 2px); clip-path: inset(10% 0 80% 0); }
          2% { transform: translate(5px, -2px); clip-path: inset(50% 0 30% 0); }
          3% { transform: translate(0); clip-path: inset(0 0 0 0); }
          50% { transform: translate(-2px, 1px); clip-path: inset(80% 0 10% 0); }
          51% { transform: translate(2px, -1px); clip-path: inset(20% 0 70% 0); }
          52% { transform: translate(0); clip-path: inset(0 0 0 0); }
          98% { transform: translate(0); }
          99% { transform: translate(10px, -5px); filter: brightness(1.2); }
          100% { transform: translate(0); filter: brightness(1); }
        }

        .hero h1 {
          position: relative;
          display: inline-block;
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
            <img src={imageUrl} alt="" />
          </div>
        )}
      </div>
    </section>
  );
};
