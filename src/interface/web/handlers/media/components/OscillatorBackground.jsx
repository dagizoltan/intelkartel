export const OscillatorBackground = () => {
  return (
    <div class="oscillator-bg">
      <style>{`
        .oscillator-bg {
          position: absolute;
          inset: 0;
          z-index: 1; /* behind text */
          pointer-events: none; /* pass clicks through */
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
        }

        .wave-container {
          width: 100%;
          height: 100%;
          position: relative;
          opacity: 0.15; /* low contrast, decorative */
          transition: opacity 0.5s ease;
        }

        .wave-container.is-playing {
          opacity: 0.4; /* slightly brighter when playing */
        }

        .wave {
          position: absolute;
          top: 50%;
          left: -10%;
          width: 120%;
          height: 2px;
          background: var(--accent-color, #b4fb51);
          transform-origin: center;
          animation-play-state: paused;
        }

        .wave::after, .wave::before {
           content: '';
           position: absolute;
           top: 0; left: 0; right: 0; bottom: 0;
           background: inherit;
        }

        /* SVG animation is much smoother for this */
        .svg-wave {
          width: 100%;
          height: 100%;
          display: block;
        }

        .svg-path {
          fill: none;
          stroke: var(--accent-color, #b4fb51);
          stroke-width: 1;
          stroke-linecap: round;
          vector-effect: non-scaling-stroke;
          transition: d 0.2s ease-out;
        }
      `}</style>

      <div class="wave-container" id="wave-container">
        <canvas id="oscillator-canvas"></canvas>
      </div>
    </div>
  );
};
