class TitoMap extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Defer execution to ensure children (the script tag) are parsed
        setTimeout(() => {
            const script = this.querySelector('script[type="application/json"]');
            if (!script) {
                console.warn("tito-map: No data script found");
                return;
            }

            try {
                const data = JSON.parse(script.textContent);
                this.initMap(data);
            } catch (e) {
                console.error("Failed to parse map data", e);
            }
        }, 0);
    }

    initMap(data) {
        // Retry logic for Leaflet loading
        if (typeof L === 'undefined') {
            if (this._retryCount === undefined) this._retryCount = 0;
            if (this._retryCount > 50) { // 5 seconds (50 * 100ms)
                console.error("Leaflet failed to load");
                return;
            }
            this._retryCount++;
            setTimeout(() => this.initMap(data), 100);
            return;
        }

        // Prevent double initialization
        if (this._mapInitialized) return;

        // Create a wrapper div for the map
        const mapContainer = document.createElement('div');
        mapContainer.style.height = '100%';
        mapContainer.style.width = '100%';
        mapContainer.style.borderRadius = '8px';
        mapContainer.style.zIndex = '1';
        mapContainer.style.position = 'relative'; // Ensure positioning context
        mapContainer.className = 'leaflet-container';

        this.appendChild(mapContainer);

        // Use element reference directly, safer than ID
        const map = L.map(mapContainer).setView(data.center || [41.47904, 2.31917], data.zoom || 15);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
             subdomains: 'abcd',
             maxZoom: 20
        }).addTo(map);

        var yellowIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="40" viewBox="0 0 24 40">' +
              '<path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 28 12 28s12-19 12-28c0-6.63-5.37-12-12-12zm0 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#9CAF88" stroke="#000" stroke-width="1"/>' +
              '</svg>';

        var yellowIcon = L.divIcon({
            html: yellowIconSvg,
            className: 'custom-map-marker',
            iconSize: [24, 40],
            iconAnchor: [12, 40],
            popupAnchor: [0, -40]
        });

        if (data.markers) {
            data.markers.forEach(m => {
                 L.marker(m.position, {icon: yellowIcon}).addTo(map);
            });
        } else {
             L.marker([41.47904, 2.31917], {icon: yellowIcon}).addTo(map);
        }

        this._mapInitialized = true;

        // Force a resize invalidation in case container size changes
        setTimeout(() => map.invalidateSize(), 100);
    }
}

customElements.define('tito-map', TitoMap);
