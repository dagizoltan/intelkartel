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
      }
      .media-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        max-width: 900px;
      }
      @media (min-width: 768px) {
        .media-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .media-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 2rem;
        text-align: left;
        transition: transform 0.2s, box-shadow 0.2s;
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
      }
      .media-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        border-color: var(--accent-color);
      }
      .media-card svg {
        width: 48px;
        height: 48px;
        margin-bottom: 1rem;
        fill: var(--accent-color);
      }
      .media-card h3 {
        margin: 0 0 0.5rem 0;
      }
      .media-card p {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin: 0;
      }
    `}</style>
    <div class="container">
      <div class="media-grid">
        <a href="/media/gallery" class="media-card">
          <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          <h3>Visual Intel</h3>
          <p>Browse our extensive gallery of operational imagery.</p>
        </a>

        <a href="/media/audio" class="media-card">
          <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          <h3>Audio Intercepts</h3>
          <p>Listen to recorded communications and sitreps.</p>
        </a>

        <a href="/media/pdf" class="media-card">
          <svg viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>
          <h3>Declassified Docs</h3>
          <p>Download and review official PDF reports.</p>
        </a>
      </div>
    </div>
  </section>
  </>
);
