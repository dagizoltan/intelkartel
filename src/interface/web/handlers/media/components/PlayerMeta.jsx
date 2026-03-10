export const PlayerMeta = ({ title, description, currentTrackTitle }) => {
  return (
    <div class="player-meta">
      <style>{`
        .player-meta {
          pointer-events: auto; /* allow text selection */
          margin-bottom: auto; /* push controls to the bottom */
          position: relative;
          z-index: 2; /* above background */
        }
        .player-meta h1 {
          color: #fff;
          margin-bottom: var(--xs, 0.5rem);
          font-size: 3rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
        .player-meta p.desc {
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: var(--xl, 2rem);
          max-width: 600px;
          font-size: 1.15rem;
          line-height: 1.5;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        .now-playing {
          margin-bottom: var(--lg, 1.5rem);
        }
        .now-playing h3 {
          color: var(--accent-color, #b4fb51);
          margin: 0;
          font-size: 1.25rem;
          font-weight: 500;
          word-break: break-word;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .now-playing h3::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: currentColor;
          box-shadow: 0 0 8px currentColor;
          animation: pulse-dot 2s infinite ease-in-out;
        }
        .now-playing.paused h3::before {
          animation: none;
          opacity: 0.5;
          box-shadow: none;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
      <h1>{title}</h1>
      <p class="desc">{description}</p>

      {currentTrackTitle && (
        <div class="now-playing" id="now-playing-container">
          <h3 id="current-track-title">{currentTrackTitle}</h3>
        </div>
      )}
    </div>
  );
};
