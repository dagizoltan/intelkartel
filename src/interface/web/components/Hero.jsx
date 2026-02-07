export const Hero = ({ title, subtitle, description, short_summary, summary, buttons }) => {
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
      <div class="container">
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
    </section>
  );
};
