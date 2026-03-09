import { Hero } from "../../components/Hero.jsx";

export const PdfPage = ({ pdfFiles }) => (
  <>
    <Hero
      title="Declassified Documents"
      description="Access official intelligence reports, manifests, and dossiers."
    />
  <section class="pdf-page">
    <style>{`
      .pdf-page {
        padding: 4rem 0;
      }
      .pdf-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-width: 1000px;
        margin: 0 auto;
      }
      .pdf-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        transition: transform 0.2s, box-shadow 0.2s;
        text-decoration: none;
        color: inherit;
      }
      .pdf-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        border-color: var(--accent-color);
      }
      .pdf-icon {
        width: 40px;
        height: 40px;
        fill: #e53935;
        margin-right: 1.5rem;
        flex-shrink: 0;
      }
      .pdf-info {
        flex: 1;
        overflow: hidden;
      }
      .pdf-title {
        font-weight: bold;
        margin-bottom: 0.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .pdf-meta {
        font-size: 0.85rem;
        color: var(--text-muted);
        display: flex;
        gap: 1rem;
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
              <svg class="pdf-icon" viewBox="0 0 24 24">
                <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
              </svg>
              <div class="pdf-info">
                <div class="pdf-title">{pdf.name}</div>
                <div class="pdf-meta">
                  <span>PDF Document</span>
                  <span>View / Download</span>
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
