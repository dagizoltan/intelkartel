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

      <script dangerouslySetInnerHTML={{ __html: `
        // Lightweight canvas animation (decorative only)
        document.addEventListener('DOMContentLoaded', () => {
          const canvas = document.getElementById('oscillator-canvas');
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          const container = document.getElementById('wave-container');

          let time = 0;
          let isPlaying = false;
          let animationId;

          // Audio player state tracking for visualizer
          const player = document.getElementById('main-audio-player');
          if (player) {
            player.addEventListener('play', () => {
              isPlaying = true;
              container.classList.add('is-playing');
            });
            player.addEventListener('pause', () => {
              isPlaying = false;
              container.classList.remove('is-playing');
            });
          }

          function resize() {
            if (!container) return;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
          }

          window.addEventListener('resize', resize);
          resize();

          function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerY = canvas.height / 2;
            const width = canvas.width;

            // Draw a few overlapping sine waves
            const numLines = 3;

            for (let j = 0; j < numLines; j++) {
              ctx.beginPath();

              // Base speed and amplitude
              let speed = isPlaying ? 0.05 + (j * 0.01) : 0.005 + (j * 0.001);
              let baseAmplitude = isPlaying ? canvas.height * 0.25 : canvas.height * 0.05;
              let frequency = 0.01 + (j * 0.005);

              ctx.lineWidth = j === 0 ? 2 : 1;
              ctx.strokeStyle = j === 0
                ? 'rgba(180, 251, 81, 0.8)' // primary accent
                : 'rgba(180, 251, 81, 0.3)'; // faded accents

              for (let x = 0; x < width; x++) {
                // Add some noise/variance when playing
                let noise = isPlaying ? Math.sin(x * 0.05 + time * 2) * 5 : 0;

                // Modulate amplitude slightly across width to look more like audio
                let mod = Math.sin(x * 0.005 + time) * 0.5 + 0.5;
                let amplitude = baseAmplitude * mod;

                // Offset each line slightly
                let yOffset = Math.sin(x * frequency + time * speed + j * 2) * amplitude + noise;
                let y = centerY + yOffset;

                if (x === 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              }

              ctx.stroke();
            }

            time += isPlaying ? 0.1 : 0.02;
            animationId = requestAnimationFrame(draw);
          }

          draw();
        });
      `}} />
    </div>
  );
};
