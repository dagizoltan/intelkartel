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
          overflow: hidden;
        }

        .tracklist-header {
          padding: var(--sm, 0.75rem) var(--md, 1rem);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-weight: 600;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: transparent;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .track-count {
          font-variant-numeric: tabular-nums;
          opacity: 0.7;
        }

        .track-list {
          list-style: none;
          padding: 0;
          margin: 0;
          overflow-y: auto;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: rgba(180, 251, 81, 0.3) transparent;
        }

        .track-list::-webkit-scrollbar {
          width: 4px;
        }

        .track-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .track-list::-webkit-scrollbar-thumb {
          background-color: rgba(180, 251, 81, 0.3);
          border-radius: 4px;
        }

        .track-list::-webkit-scrollbar-thumb:hover {
          background-color: var(--accent-color, #b4fb51);
        }

        .track-item {
          padding: 0.5rem var(--md, 1rem); /* Reduced padding */
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.15s ease, color 0.15s ease;
          color: rgba(255, 255, 255, 0.6);
          position: relative;
        }

        .track-item:last-child {
          border-bottom: none;
        }

        .track-item:hover {
          color: rgba(255, 255, 255, 0.9);
          background-color: rgba(255, 255, 255, 0.03);
        }

        .track-item.active {
          color: var(--accent-color, #b4fb51);
          background-color: rgba(180, 251, 81, 0.05);
        }

        .track-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: var(--accent-color, #b4fb51);
        }

        .track-icon {
          margin-right: 0.75rem;
          fill: currentColor;
          flex-shrink: 0;
          width: 14px;
          height: 14px;
          opacity: 0.5;
        }

        .track-item:hover .track-icon,
        .track-item.active .track-icon {
          opacity: 1;
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
          font-size: 0.7rem;
          opacity: 0.5;
          min-width: 1.5rem;
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
        <span>Tracklist</span>
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
