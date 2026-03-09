import { Hero } from "../../components/Hero.jsx";

export const GalleryPage = ({ images }) => (
  <>
    <Hero
      title="Visual Intel Gallery"
      description="Operational imagery and visual evidence collected from the field."
    />
  <section class="gallery-page">
    <style>{`
      .gallery-page {
        padding: 4rem 0;
      }
      .gallery-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      @media (min-width: 768px) {
        .gallery-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (min-width: 992px) {
        .gallery-grid {
          grid-template-columns: repeat(3, 1fr);
        }
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
  </>
);
