export const GalleryPage = ({ images }) => (
  <section class="gallery-page">
    <style>{`
      .gallery-page {
        padding: 4rem 0;
      }
      .page-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      .page-header h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }
      .page-header p {
        color: var(--text-muted);
      }
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }
      .gallery-item {
        display: block;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s, border-color 0.2s;
        text-decoration: none;
        aspect-ratio: 1 / 1;
      }
      .gallery-item:hover {
        transform: scale(1.02);
        border-color: var(--accent-color);
      }
      .gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .empty-state {
        text-align: center;
        padding: 3rem;
        background: var(--bg-card);
        border-radius: 8px;
        grid-column: 1 / -1;
        color: var(--text-muted);
      }
    `}</style>
    <div class="container">
      <div class="page-header">
        <h1>Visual Intel Gallery</h1>
        <p>Operational imagery and visual evidence collected from the field.</p>
      </div>

      <div class="gallery-grid">
        {images.length === 0 ? (
          <div class="empty-state">No visual intelligence available at this time.</div>
        ) : (
          images.map((img, index) => (
            <a href={img.url} target="_blank" rel="noopener noreferrer" class="gallery-item">
              <img src={img.url} alt={`Intelligence record ${index + 1}`} loading="lazy" />
            </a>
          ))
        )}
      </div>
    </div>
  </section>
);
