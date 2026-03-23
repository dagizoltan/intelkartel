import { Hero } from "../../components/Hero.jsx";

export const PdfPage = ({ pdfFiles }) => (
  <>
    <Hero
      title="Classified Intelligence Library"
      description="Access restricted intelligence reports, historical dossiers, and declassified operational handbooks."
    />
  <section class="pdf-page">
    <style>{`
      .pdf-page {
        padding: 4rem 0;
      }
      .pdf-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      @media (min-width: 768px) {
        .pdf-grid {
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
      }
      .pdf-card {
        background: var(--secondary-bg);
        border: 1px solid var(--border-color);
        border-radius: 0px;
        padding: 1.5rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        transition: all 0.2s ease;
        text-decoration: none;
        color: inherit;
        position: relative;
        overflow: hidden;
      }
      @media (min-width: 768px) {
        .pdf-card {
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
      }
      .pdf-card::before {
        content: "RESTRICTED";
        position: absolute;
        top: 10px;
        right: -30px;
        background: rgba(180, 251, 81, 0.2);
        color: var(--primary-color);
        font-family: 'Space Mono', monospace;
        font-size: 0.6rem;
        padding: 4px 40px;
        transform: rotate(45deg);
        border: 1px solid var(--primary-color);
        pointer-events: none;
        z-index: 1;
      }
      .pdf-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 0 15px var(--glow-shadow);
        border-color: var(--primary-color);
        background: var(--card-bg-hover);
      }
      .pdf-icon {
        width: 40px;
        height: 40px;
        fill: var(--primary-color);
        margin-right: 1.5rem;
        flex-shrink: 0;
        filter: drop-shadow(0 0 2px var(--primary-color));
      }
      @media (min-width: 768px) {
        .pdf-icon {
          margin-right: 0;
          margin-bottom: 1.5rem;
          width: 48px;
          height: 48px;
        }
      }
      .pdf-info {
        flex: 1;
        overflow: hidden;
      }
      .pdf-title {
        font-weight: bold;
        margin-bottom: 0.5rem;
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        font-family: 'Space Mono', monospace;
        text-transform: uppercase;
        word-break: break-word;
        font-size: 0.9rem;
      }
      .pdf-meta {
        font-family: 'Space Mono', monospace;
        font-size: 0.7rem;
        color: var(--primary-color);
        opacity: 0.7;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        text-transform: uppercase;
      }
      .pdf-ref {
        font-size: 0.6rem;
        letter-spacing: 1px;
        color: var(--primary-color);
        opacity: 0.5;
        margin-bottom: 0.5rem;
      }
      .pdf-action {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        display: inline-block;
      }
      .empty-state {
        text-align: center;
        padding: 3rem;
        background: var(--bg-card);
        border-radius: 8px;
        color: var(--text-muted);
      }
    `}</style>
    <div class="container">
      {pdfFiles.length === 0 ? (
        <div class="empty-state">No declassified documents available at this time.</div>
      ) : (
        <div class="pdf-grid">
          {pdfFiles.map((pdf, index) => (
            <a href={pdf.url} target="_blank" rel="noopener noreferrer" class="pdf-card">
              <div class="pdf-ref">REF_ID: IK-LIB-{index.toString().padStart(4, '0')}</div>
              <svg class="pdf-icon" viewBox="0 0 24 24">
                <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
              </svg>
              <div class="pdf-info">
                <div class="pdf-title">{pdf.name}</div>
                <div class="pdf-meta">
                  <span>Dossier Archive</span>
                  <span>Access: UNRESTRICTED_BETA</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  </section>
  </>
);
