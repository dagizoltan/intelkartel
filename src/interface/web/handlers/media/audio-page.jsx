import { raw } from 'hono/html';

export const AudioPage = ({ audioFiles }) => {
  const hasAudio = audioFiles && audioFiles.length > 0;

  return (
    <>
      <section class="hero audio-hero">
        <style>{`
          .audio-hero {
            padding: var(--xxl) var(--md);
            min-height: var(--hero-min-height);
            display: flex;
            align-items: center;
          }

          .audio-hero-container {
            width: 100%;
            max-width: var(--container-max-width);
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--xxl);
          }

          @media (min-width: 992px) {
            .audio-hero-container {
              grid-template-columns: 1fr 350px;
              align-items: start;
            }
          }

          .audio-main-col {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .audio-hero h1 {
            color: #fff;
            margin-bottom: var(--md);
          }

          .audio-hero p.desc {
            color: #fff;
            margin-bottom: var(--lg);
            max-width: var(--content-max-width);
          }

          .player-section {
            background: var(--bg-card, rgba(0,0,0,0.3));
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: var(--xl);
            margin-top: var(--md);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .now-playing h3 {
            color: var(--accent-color);
            margin: 0 0 var(--md) 0;
            font-size: 1.2rem;
            word-break: break-all;
          }

          .main-player {
            width: 100%;
            margin-bottom: var(--md);
            outline: none;
          }

          /* Visualizer canvas */
          #audio-visualizer {
            width: 100%;
            height: 100px;
            background-color: rgba(0,0,0,0.2);
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            display: block;
          }

          .tracklist-col {
            background: var(--bg-card, rgba(0,0,0,0.3));
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            display: flex;
            flex-direction: column;
            max-height: 600px;
          }

          .tracklist-header {
            padding: var(--md);
            border-bottom: 1px solid var(--border-color);
            font-weight: bold;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: var(--letter-spacing-md);
          }

          .track-list {
            list-style: none;
            padding: 0;
            margin: 0;
            overflow-y: auto;
            flex: 1;
          }

          .track-item {
            padding: var(--md);
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: background-color 0.2s;
            color: var(--text-color);
          }

          .track-item:last-child {
            border-bottom: none;
          }

          .track-item:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }

          .track-item.active {
            background-color: rgba(255, 255, 255, 0.1);
            border-left: 4px solid var(--accent-color);
          }

          .track-icon {
            margin-right: var(--md);
            fill: var(--text-muted, #888);
            flex-shrink: 0;
          }

          .track-item.active .track-icon {
            fill: var(--accent-color);
          }

          .track-info {
            flex: 1;
            min-width: 0;
          }

          .track-title {
            font-weight: 500;
            margin-bottom: 0.25rem;
            word-break: break-all;
            font-size: 0.9rem;
          }

          .track-meta {
            font-size: 0.8rem;
            color: var(--text-muted, #888);
          }

          .empty-state {
            padding: var(--xl);
            color: var(--text-muted, #888);
            text-align: center;
          }

          audio::-webkit-media-controls-panel {
            background-color: var(--bg-secondary, #2a2a2a);
          }
          audio::-webkit-media-controls-play-button,
          audio::-webkit-media-controls-mute-button,
          audio::-webkit-media-controls-timeline,
          audio::-webkit-media-controls-current-time-display,
          audio::-webkit-media-controls-time-remaining-display {
            color: var(--text-color, #fff);
            filter: invert(1);
          }
        `}</style>

        <div class="audio-hero-container">
          <div class="audio-main-col">
            <h1>Audio Intercepts</h1>
            <p class="desc">Unredacted communications and situation reports.</p>

            <div class="player-section">
              {hasAudio ? (
                <>
                  <div class="now-playing">
                    <h3 id="current-track-title">Select a track to play</h3>
                  </div>

                  <audio id="main-audio-player" class="main-player" controls preload="metadata" crossorigin="anonymous">
                    <source src={audioFiles[0].url} id="audio-source" />
                    Your browser does not support the audio element.
                  </audio>

                  <canvas id="audio-visualizer"></canvas>
                </>
              ) : (
                <div class="empty-state">No audio intercepts available at this time.</div>
              )}
            </div>
          </div>

          {hasAudio && (
            <div class="tracklist-col">
              <div class="tracklist-header">Tracklist</div>
              <ul class="track-list" id="track-list">
                {audioFiles.map((file, index) => (
                  <li class={`track-item ${index === 0 ? 'active' : ''}`} data-url={file.url} data-title={file.name}>
                    <svg class="track-icon" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                    <div class="track-info">
                      <div class="track-title">{file.name}</div>
                      <div class="track-meta">Intercepted Audio File</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {hasAudio && (
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const player = document.getElementById('main-audio-player');
            const source = document.getElementById('audio-source');
            const trackList = document.getElementById('track-list');
            const tracks = trackList.querySelectorAll('.track-item');
            const currentTitle = document.getElementById('current-track-title');
            const canvas = document.getElementById('audio-visualizer');
            const canvasCtx = canvas.getContext('2d');

            let audioCtx;
            let analyser;
            let dataArray;
            let sourceNode;
            let isInitialized = false;

            if (tracks.length > 0) {
              currentTitle.textContent = tracks[0].getAttribute('data-title');
            }

            function initAudio() {
              if (isInitialized) return;

              audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              analyser = audioCtx.createAnalyser();
              sourceNode = audioCtx.createMediaElementSource(player);

              sourceNode.connect(analyser);
              analyser.connect(audioCtx.destination);

              analyser.fftSize = 256;
              const bufferLength = analyser.frequencyBinCount;
              dataArray = new Uint8Array(bufferLength);

              isInitialized = true;
              draw();
            }

            function draw() {
              requestAnimationFrame(draw);

              // Canvas responsive size
              canvas.width = canvas.clientWidth;
              canvas.height = canvas.clientHeight;

              if (!isInitialized) {
                // Draw flat line if not playing yet
                canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = '#b4fb51';
                canvasCtx.beginPath();
                canvasCtx.moveTo(0, canvas.height / 2);
                canvasCtx.lineTo(canvas.width, canvas.height / 2);
                canvasCtx.stroke();
                return;
              }

              analyser.getByteFrequencyData(dataArray);

              canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
              canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

              const barWidth = (canvas.width / analyser.frequencyBinCount) * 2.5;
              let barHeight;
              let x = 0;

              for (let i = 0; i < analyser.frequencyBinCount; i++) {
                barHeight = dataArray[i] / 255 * canvas.height;

                canvasCtx.fillStyle = '#b4fb51';
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
              }
            }

            // Draw initial flat line
            draw();

            player.addEventListener('play', () => {
              initAudio();
              if (audioCtx.state === 'suspended') {
                audioCtx.resume();
              }
            });

            tracks.forEach(track => {
              track.addEventListener('click', function() {
                tracks.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const url = this.getAttribute('data-url');
                const title = this.getAttribute('data-title');

                source.src = url;
                currentTitle.textContent = title;

                player.load();

                // Needed for some browsers to trigger initAudio
                initAudio();

                player.play().catch(e => console.log('Playback prevented:', e));
              });
            });

            player.addEventListener('ended', function() {
              const activeTrack = trackList.querySelector('.track-item.active');
              if (activeTrack && activeTrack.nextElementSibling) {
                activeTrack.nextElementSibling.click();
              }
            });
          });
        `}} />
      )}
    </>
  );
};
