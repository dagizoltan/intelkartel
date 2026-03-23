import { Hero } from "../../components/Hero.jsx";

export const MediaPage = () => (
  <>
    <Hero
      title="Classified Media Archive"
      description="Access intercepted communications, operational imagery, and unredacted intelligence documents."
    />
  <section class="media-landing">
    <style>{`
      .media-landing {
        padding: 4rem 0;
        position: relative;
      }
      .media-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        position: relative;
        z-index: 2;
      }
      @media (min-width: 1024px) {
        .media-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .media-card {
        background: var(--secondary-bg);
        border: 1px solid var(--border-color);
        border-radius: 0px;
        padding: 2rem;
        text-align: left;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      .media-card::before {
        content: "CLASSIFIED // LEVEL 4";
        position: absolute;
        top: 0;
        left: 0;
        background: var(--primary-color);
        color: var(--bg-color);
        font-family: 'Space Mono', monospace;
        font-size: 0.5rem;
        padding: 2px 6px;
        font-weight: bold;
        letter-spacing: 1px;
      }
      .media-card::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          rgba(18, 16, 16, 0) 50%,
          rgba(0, 0, 0, 0.1) 50%
        ), linear-gradient(
          90deg,
          rgba(255, 0, 0, 0.03),
          rgba(0, 255, 0, 0.01),
          rgba(0, 0, 255, 0.03)
        );
        background-size: 100% 2px, 3px 100%;
        pointer-events: none;
        opacity: 0.3;
      }
      .media-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 0 20px var(--glow-shadow);
        border-color: var(--primary-color);
        background: var(--card-bg-hover);
      }
      .media-card:hover h3 {
        text-shadow: 0 0 8px var(--primary-color);
      }
      .media-card svg {
        width: 48px;
        height: 48px;
        margin-bottom: 1.5rem;
        fill: var(--primary-color);
        filter: drop-shadow(0 0 5px var(--primary-color));
      }
      .media-card h3 {
        margin: 0 0 0.5rem 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        transition: text-shadow 0.3s ease;
      }
      .media-card .status {
        font-family: 'Space Mono', monospace;
        font-size: 0.6rem;
        padding: 2px 8px;
        border: 1px solid currentColor;
        border-radius: 0px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .media-card p {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin: 0 0 1rem 0;
      }
      .media-card .meta {
        font-family: 'Space Mono', monospace;
        font-size: 0.65rem;
        color: var(--primary-color);
        opacity: 0.8;
      }
      .scanline {
        width: 100%;
        height: 100px;
        z-index: 10;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(180, 251, 81, 0.1) 50%, rgba(0, 0, 0, 0) 100%);
        opacity: 0.1;
        position: absolute;
        bottom: 100%;
        left: 0;
        pointer-events: none;
        animation: scanline 8s linear infinite;
      }
      @keyframes scanline {
        0% { bottom: 100%; }
        100% { bottom: -100px; }
      }
    `}</style>
    <div class="container">
      <div class="scanline"></div>
      <div class="media-grid">
        <a href="/media/gallery" class="media-card">
          <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          <h3>Visual Intel <span class="status">Live</span></h3>
          <p>Browse our extensive gallery of operational imagery.</p>
          <div class="meta">SOURCE: FIELD_CAM_A7 // ENCRYPTION: NONE</div>
        </a>

        <a href="/media/audio" class="media-card">
          <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          <h3>Audio Intercepts <span class="status">Intercept</span></h3>
          <p>Listen to recorded communications and sitreps.</p>
          <div class="meta">FREQ: 144.800MHz // CODEC: OPUS_REDACTED</div>
        </a>

        <a href="/media/pdf" class="media-card">
          <svg viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>
          <h3>Classified Library <span class="status">Archive</span></h3>
          <p>Download and review official PDF reports and books.</p>
          <div class="meta">REF: IK-OPT-99 // CLEARANCE: LEVEL_1</div>
        </a>
      </div>
    </div>
  </section>
  </>
);
