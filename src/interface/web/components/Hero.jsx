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
        .hero-glitch-wrapper {
          position: relative;
          width: 100%;
          animation: whole-hero-glitch 4s step-end infinite;
        }
        @keyframes whole-hero-glitch {
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
        .hero h1::before,
        .hero h1::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--secondary-bg);
          z-index: -1;
        }
        .hero h1::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        .hero h1::after {
          left: -2px;
          text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
          animation: glitch-anim2 1s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim {
          0% { clip: rect(31px, 9999px, 94px, 0); transform: skew(0.85deg); }
          5% { clip: rect(70px, 9999px, 71px, 0); transform: skew(0.51deg); }
          10% { clip: rect(29px, 9999px, 83px, 0); transform: skew(0.66deg); }
          15% { clip: rect(46px, 9999px, 11px, 0); transform: skew(0.06deg); }
          20% { clip: rect(61px, 9999px, 52px, 0); transform: skew(0.05deg); }
          25% { clip: rect(10px, 9999px, 54px, 0); transform: skew(0.25deg); }
          30% { clip: rect(35px, 9999px, 20px, 0); transform: skew(0.09deg); }
          35% { clip: rect(93px, 9999px, 12px, 0); transform: skew(0.12deg); }
          40% { clip: rect(66px, 9999px, 52px, 0); transform: skew(0.97deg); }
          45% { clip: rect(60px, 9999px, 4px, 0); transform: skew(0.19deg); }
          50% { clip: rect(2px, 9999px, 64px, 0); transform: skew(0.79deg); }
          55% { clip: rect(96px, 9999px, 80px, 0); transform: skew(0.66deg); }
          60% { clip: rect(51px, 9999px, 14px, 0); transform: skew(0.96deg); }
          65% { clip: rect(40px, 9999px, 20px, 0); transform: skew(0.16deg); }
          70% { clip: rect(81px, 9999px, 98px, 0); transform: skew(0.81deg); }
          75% { clip: rect(67px, 9999px, 56px, 0); transform: skew(0.66deg); }
          80% { clip: rect(92px, 9999px, 20px, 0); transform: skew(0.5deg); }
          85% { clip: rect(35px, 9999px, 21px, 0); transform: skew(0.68deg); }
          90% { clip: rect(93px, 9999px, 71px, 0); transform: skew(0.24deg); }
          95% { clip: rect(62px, 9999px, 3px, 0); transform: skew(0.21deg); }
          100% { clip: rect(27px, 9999px, 26px, 0); transform: skew(0.53deg); }
        }
        @keyframes glitch-anim2 {
          0% { clip: rect(44px, 9999px, 56px, 0); transform: skew(0.1deg); }
          5% { clip: rect(70px, 9999px, 71px, 0); transform: skew(0.2deg); }
          10% { clip: rect(29px, 9999px, 83px, 0); transform: skew(0.3deg); }
          15% { clip: rect(46px, 9999px, 11px, 0); transform: skew(0.4deg); }
          20% { clip: rect(61px, 9999px, 52px, 0); transform: skew(0.5deg); }
          25% { clip: rect(10px, 9999px, 54px, 0); transform: skew(0.6deg); }
          30% { clip: rect(35px, 9999px, 20px, 0); transform: skew(0.7deg); }
          35% { clip: rect(93px, 9999px, 12px, 0); transform: skew(0.8deg); }
          40% { clip: rect(66px, 9999px, 52px, 0); transform: skew(0.9deg); }
          45% { clip: rect(60px, 9999px, 4px, 0); transform: skew(1deg); }
          50% { clip: rect(2px, 9999px, 64px, 0); transform: skew(0.1deg); }
          55% { clip: rect(96px, 9999px, 80px, 0); transform: skew(0.2deg); }
          60% { clip: rect(51px, 9999px, 14px, 0); transform: skew(0.3deg); }
          65% { clip: rect(40px, 9999px, 20px, 0); transform: skew(0.4deg); }
          70% { clip: rect(81px, 9999px, 98px, 0); transform: skew(0.5deg); }
          75% { clip: rect(67px, 9999px, 56px, 0); transform: skew(0.6deg); }
          80% { clip: rect(92px, 9999px, 20px, 0); transform: skew(0.7deg); }
          85% { clip: rect(35px, 9999px, 21px, 0); transform: skew(0.8deg); }
          90% { clip: rect(93px, 9999px, 71px, 0); transform: skew(0.9deg); }
          95% { clip: rect(62px, 9999px, 3px, 0); transform: skew(1deg); }
          100% { clip: rect(27px, 9999px, 26px, 0); transform: skew(0.1deg); }
        }
      `}</style>
      <div class="hero-glitch-wrapper">
        <div class="container hero-container-flex">
          <div class="hero-content">
            <h1 data-text={title}>{title}</h1>
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
      </div>
    </section>
  );
};
