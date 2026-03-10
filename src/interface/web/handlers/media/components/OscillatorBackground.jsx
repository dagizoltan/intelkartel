export const OscillatorBackground = () => {
  return (
    <div class="oscillator-bg">
      <style>{`
        .oscillator-bg {
          /* No longer absolutely positioned */
          position: relative;
          width: 100%;
          flex: 1; /* take up available space in the column */
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
          margin-bottom: var(--md, 1rem); /* Space above text */
        }

        .wave-container {
          width: 100%;
          height: 100%;
          position: relative;
          opacity: 0.15; /* low contrast, decorative */
          transition: opacity 0.5s ease;
        }

        .wave-container.is-playing {
          opacity: 0.6; /* brighter when playing */
        }
      `}</style>

      <div class="wave-container" id="wave-container">
        <canvas id="oscillator-canvas"></canvas>
      </div>
    </div>
  );
};
