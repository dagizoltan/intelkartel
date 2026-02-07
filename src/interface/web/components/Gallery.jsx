export const Gallery = ({ gallery }) => {
  if (!gallery || gallery.length === 0) return null;

  return (
    <section class="gallery-section">
      <style>{`
        .gallery-section {
          padding: 2rem 0;
          width: 100%;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .gallery-item picture img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          aspect-ratio: 1/1;
          display: block;
          border-radius: 8px;
        }
        @media (min-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
      <div class="container">
        <div class="gallery-grid">
          {gallery.map((img, index) => (
            <div class="gallery-item">
              <picture>
                  <img src={img} alt={`Gallery image ${index + 1}`} loading="lazy" width="200" height="200" />
              </picture>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
