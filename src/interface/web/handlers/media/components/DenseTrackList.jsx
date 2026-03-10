export const DenseTrackList = ({ audioFiles }) => {
  return (
    <div class="tracklist-col">
      <style>{`
        .tracklist-col {
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - var(--bottom-nav-height, 60px) - 100px);
          height: 100%;
          background: transparent;
          border: none;
          /* Subtly separate list from player */
          border-left: 1px solid rgba(180, 251, 81, 0.1);
          padding-left: var(--md, 1rem); /* Space off the border */
          overflow: hidden;
        }

        .tracklist-header {
          padding: 0 var(--sm, 0.75rem) var(--sm, 0.75rem) var(--sm, 0.75rem);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 700;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          background: transparent;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--sm, 0.5rem);
        }

        .track-count {
          font-variant-numeric: tabular-nums;
          opacity: 0.5;
        }

        .track-list {
          list-style: none;
          padding: 0;
          margin: 0;
          overflow-y: auto;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: rgba(180, 251, 81, 0.2) transparent;
        }

        .track-list::-webkit-scrollbar {
          width: 2px;
        }

        .track-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .track-list::-webkit-scrollbar-thumb {
          background-color: rgba(180, 251, 81, 0.2);
          border-radius: 2px;
        }

        .track-list::-webkit-scrollbar-thumb:hover {
          background-color: rgba(180, 251, 81, 0.6);
        }

        .track-item {
          padding: 0.4rem var(--sm, 0.75rem);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s;
          color: rgba(255, 255, 255, 0.5);
          border-radius: 4px; /* subtle rounded edges for hover */
          margin-bottom: 2px;
        }

        .track-item:hover {
          color: rgba(255, 255, 255, 0.85);
          background-color: rgba(255, 255, 255, 0.02);
          transform: translateX(2px); /* slight shift */
        }

        .track-item.active {
          color: var(--accent-color, #b4fb51);
          background-color: rgba(180, 251, 81, 0.03);
          text-shadow: 0 0 10px rgba(180, 251, 81, 0.3);
          transform: translateX(2px);
        }

        .track-icon {
          margin-right: 0.75rem;
          fill: currentColor;
          flex-shrink: 0;
          width: 12px;
          height: 12px;
          opacity: 0.3;
          transition: opacity 0.2s;
        }

        .track-item:hover .track-icon {
          opacity: 0.8;
        }

        .track-item.active .track-icon {
          opacity: 1;
          filter: drop-shadow(0 0 2px currentColor);
        }

        .track-info {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .track-index {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          opacity: 0.4;
          min-width: 1.25rem;
        }

        .track-title {
          font-weight: 400;
          margin-bottom: 0;
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .track-item.active .track-title {
          font-weight: 500;
        }
      `}</style>

      <div class="tracklist-header">
        <span>Intercept Log</span>
        <span class="track-count">{audioFiles.length} files</span>
      </div>
      <ul class="track-list" id="track-list">
        {audioFiles.map((file, index) => (
          <li class={`track-item ${index === 0 ? 'active' : ''}`} data-url={file.url} data-title={file.name}>
            <svg class="track-icon" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <div class="track-info">
              <span class="track-index">{(index + 1).toString().padStart(2, '0')}</span>
              <div class="track-title">{file.name}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
