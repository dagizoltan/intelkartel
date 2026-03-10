export const OscillatorBackground = () => {
  return (
    <div class="oscillator-bg">
      <style>{`
        .oscillator-bg {
          /* No longer absolutely positioned */
          position: relative;
          width: 100%;
          flex: 1; /* take up available space in the column */
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: var(--lg, 2rem); /* Space above text */
          border: 1px solid rgba(180, 251, 81, 0.1);
          border-radius: var(--border-radius, 8px);
          background-color: rgba(5, 5, 5, 0.5); /* subtle dark backing */
        }

        /* Subtle moving surveillance grid */
        .oscillator-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image:
            linear-gradient(rgba(180, 251, 81, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180, 251, 81, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: center center;
          pointer-events: none;
          z-index: 0;
          animation: pan-grid 60s linear infinite;
          mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
        }

        @keyframes pan-grid {
          0% { background-position: 0 0; }
          100% { background-position: -100px -100px; }
        }

        .wave-container {
          width: 100%;
          height: 100%;
          position: relative;
          opacity: 0.2; /* low contrast, decorative */
          transition: opacity 0.5s ease;
          z-index: 1;
        }

        .wave-container.is-playing {
          opacity: 0.8; /* brighter when playing */
        }
      `}</style>

      <div class="wave-container" id="wave-container">
        <canvas id="oscillator-canvas"></canvas>
      </div>
    </div>
  );
};
