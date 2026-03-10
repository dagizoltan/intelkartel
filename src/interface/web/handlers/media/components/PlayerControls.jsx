export const PlayerControls = () => {
  return (
    <div class="custom-player-controls">
      <style>{`
        .custom-player-controls {
          display: flex;
          align-items: center;
          gap: var(--md, 1rem);
          width: 100%;
          padding: var(--md, 1rem) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: auto; /* Push to bottom of container */
          position: relative;
          z-index: 2; /* above background */
          pointer-events: auto; /* <--- FIX: Ensure controls receive clicks */
        }

        .play-btn {
          background: var(--accent-color, #b4fb51);
          color: #000;
          border: none;
          cursor: pointer;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(180, 251, 81, 0.2);
        }

        .play-btn:hover {
          transform: scale(1.05);
          background: #cbfb7b;
          box-shadow: 0 6px 16px rgba(180, 251, 81, 0.4);
        }

        .play-btn:active {
          transform: scale(0.95);
        }

        .play-btn svg {
          width: 24px;
          height: 24px;
          fill: currentColor;
          margin-left: 2px; /* slight visual center adjustment for play icon */
        }

        .play-btn.is-playing svg {
          margin-left: 0; /* center pause icon */
        }

        .time-display {
          font-family: var(--font-mono, monospace);
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          min-width: 45px;
          text-align: center;
          flex-shrink: 0;
          user-select: none;
        }

        .seek-container {
          flex: 1; /* Take up remaining space */
          display: flex;
          align-items: center;
          position: relative;
          height: 24px;
          cursor: pointer;
          margin: 0 var(--sm, 0.5rem);
        }

        .seek-bar-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .seek-bar-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--accent-color, #b4fb51);
          width: 0%;
          border-radius: 2px;
          pointer-events: none;
        }

        /* Invisible native slider overlaying custom track for easiest interaction */
        .seek-slider {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          margin: 0;
          padding: 0;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: var(--sm, 0.5rem);
          color: rgba(255, 255, 255, 0.6);
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .volume-control:hover {
          color: rgba(255, 255, 255, 1);
        }

        .volume-control svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .volume-slider-container {
          position: relative;
          width: 80px;
          height: 24px;
          display: flex;
          align-items: center;
        }

        .volume-slider-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          position: absolute;
          pointer-events: none;
        }

        .volume-slider-progress {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          height: 4px;
          background: currentColor;
          width: 100%;
          border-radius: 2px;
          pointer-events: none;
        }

        .volume-slider {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          margin: 0;
        }

        .hidden {
          display: none !important;
        }
      `}</style>

      <button id="play-pause-btn" class="play-btn" aria-label="Play/Pause">
         {/* Default Play Icon */}
         <svg id="icon-play" viewBox="0 0 24 24" class=""><path d="M8 5v14l11-7z"/></svg>
         {/* Hidden Pause Icon */}
         <svg id="icon-pause" viewBox="0 0 24 24" class="hidden"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>

      <div class="time-display" id="current-time">0:00</div>

      <div class="seek-container">
        <div class="seek-bar-track">
          <div class="seek-bar-progress" id="seek-progress"></div>
        </div>
        <input type="range" id="seek-slider" class="seek-slider" min="0" max="100" value="0" step="0.1" aria-label="Seek track" />
      </div>

      <div class="time-display" id="duration">0:00</div>

      <div class="volume-control" title="Volume">
        <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        <div class="volume-slider-container">
          <div class="volume-slider-track"></div>
          <div class="volume-slider-progress" id="volume-progress"></div>
          <input type="range" id="volume-slider" class="volume-slider" min="0" max="1" step="0.01" value="1" aria-label="Volume" />
        </div>
      </div>
    </div>
  );
};
