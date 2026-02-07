import { html, raw } from 'hono/html';

export const Map = ({ title, address, buttonText }) => {
  // Zummogo coordinates (approximate, Budapest)
  const lat = 47.4979;
  const long = 19.0402;
  const mapData = {
    center: [lat, long],
    zoom: 15,
    markers: [{ position: [lat, long] }]
  };

  return (
    <>
      <section class="map-section">
        <div class="container">
          {title && <h2>{title}</h2>}
          {address && <p>{address}</p>}

          <tito-map style="display: block; width: 100%; height: 400px; background-color: #eee; position: relative; border-radius: var(--border-radius-lg); overflow: hidden;">
             <script type="application/json" dangerouslySetInnerHTML={{ __html: raw(JSON.stringify(mapData)) }} />
          </tito-map>

          <noscript>
            <div class="map-fallback">
              <p><strong>Zümmögő</strong></p>
              <p>{address || "Zümmögő pékség & kávézó"}</p>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`} target="_blank">Get Directions</a>
            </div>
          </noscript>
          <div class="btn-group" style="margin-top: 2rem;">
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`} target="_blank" class="btn">{buttonText || "Útvonaltervezés"}</a>
          </div>
        </div>
      </section>
      <script src="/static/js/tito-map.js" type="module"></script>
    </>
  );
};
