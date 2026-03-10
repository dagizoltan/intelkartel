export const AudioPage = ({ audioFiles }) => {
  const hasAudio = audioFiles && audioFiles.length > 0;

  return (
    <>
      <section class="hero audio-hero">
        <style>{`
          .audio-hero {
            padding: var(--xxl) var(--md);
            min-height: calc(100vh - var(--bottom-nav-height) - 100px);
            display: flex;
            align-items: stretch;
          }

          .audio-hero-container {
            width: 100%;
            max-width: var(--container-max-width);
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--xxl);
            height: 100%;
          }

          @media (min-width: 992px) {
            .audio-hero-container {
              grid-template-columns: 1fr 300px; /* Made tracklist column slightly narrower */
            }
          }

          .audio-main-col {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            min-height: 400px;
          }

          /* Visualizer canvas (Background) */
          #audio-visualizer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none; /* Let clicks pass through to controls */
          }

          /* Content above visualizer */
          .audio-content-layer {
            position: relative;
            z-index: 2;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding-bottom: var(--md);
            height: 100%;
            pointer-events: none; /* Make container pass-through */
          }

          /* Make interactive elements clickable */
          .audio-content-layer h1,
          .audio-content-layer p,
          .audio-content-layer .now-playing,
          .custom-player-controls {
            pointer-events: auto;
          }

          .audio-hero h1 {
            color: #fff;
            margin-bottom: var(--xs);
            font-size: 3rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          }

          .audio-hero p.desc {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: var(--lg);
            max-width: var(--content-max-width);
            font-size: 1.1rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          }

          .now-playing {
            margin-bottom: var(--sm);
          }

          .now-playing h3 {
            color: var(--accent-color);
            margin: 0;
            font-size: 1.2rem;
            word-break: break-all;
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          }

          /* Custom Player Controls */
          .custom-player-controls {
            display: flex;
            align-items: center;
            gap: var(--md);
            background: rgba(0,0,0,0.4); /* Slight dark backing for legibility */
            padding: var(--sm) var(--md);
            border-radius: var(--border-radius);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(180, 251, 81, 0.2);
            width: fit-content;
          }

          .play-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            transition: transform 0.1s;
          }

          .play-btn:hover {
            transform: scale(1.1);
          }

          .play-btn svg {
            width: 32px;
            height: 32px;
            fill: currentColor;
          }

          .time-indicator {
            font-family: monospace;
            font-size: 0.9rem;
            color: var(--text-color);
            min-width: 90px;
          }

          .volume-control {
            display: flex;
            align-items: center;
            gap: var(--xs);
            color: var(--primary-color);
          }

          .volume-control svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
          }

          .volume-slider {
            width: 80px;
            accent-color: var(--primary-color);
            cursor: pointer;
          }

          /* Hidden native audio element */
          #main-audio-player {
            display: none;
          }

          /* Tracklist - Dense styling */
          .tracklist-col {
            display: flex;
            flex-direction: column;
            max-height: calc(100vh - var(--bottom-nav-height) - 150px);
            height: 100%;
            background: var(--secondary-bg, rgba(20,20,20,0.8));
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
          }

          .tracklist-header {
            padding: var(--sm) var(--sm);
            border-bottom: 1px solid var(--border-color);
            font-weight: bold;
            font-size: 0.9rem;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: var(--letter-spacing-md);
            background: rgba(0,0,0,0.2);
          }

          .track-list {
            list-style: none;
            padding: 0;
            margin: 0;
            overflow-y: auto;
            flex: 1;
            scrollbar-width: thin;
            scrollbar-color: var(--primary-color) transparent;
          }

          .track-list::-webkit-scrollbar {
            width: 4px;
          }

          .track-list::-webkit-scrollbar-track {
            background: transparent;
          }

          .track-list::-webkit-scrollbar-thumb {
            background-color: var(--primary-color);
            border-radius: 4px;
          }

          .track-item {
            padding: var(--xs) var(--sm);
            border-bottom: 1px solid rgba(180, 251, 81, 0.1);
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: background-color 0.2s, color 0.2s;
            color: rgba(255, 255, 255, 0.7);
          }

          .track-item:last-child {
            border-bottom: none;
          }

          .track-item:hover {
            color: #fff;
            background-color: rgba(180, 251, 81, 0.05);
          }

          .track-item.active {
            color: #fff;
            background-color: rgba(180, 251, 81, 0.1);
            border-left: 2px solid var(--primary-color);
          }

          .track-icon {
            margin-right: var(--sm);
            fill: currentColor;
            flex-shrink: 0;
            width: 16px;
            height: 16px;
          }

          .track-info {
            flex: 1;
            min-width: 0;
          }

          .track-title {
            font-weight: 500;
            margin-bottom: 0;
            word-break: break-all;
            font-size: 0.8rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .empty-state {
            padding: var(--xl);
            color: var(--text-muted, #888);
            text-align: center;
          }
        `}</style>

        <div class="audio-hero-container">
          <div class="audio-main-col">
            {hasAudio && (
               <canvas id="audio-visualizer"></canvas>
            )}

            <div class="audio-content-layer">
              <h1>Audio Intercepts</h1>
              <p class="desc">Unredacted communications and situation reports.</p>

              {hasAudio ? (
                <>
                  <div class="now-playing">
                    <h3 id="current-track-title">Select a track to play</h3>
                  </div>

                  <div class="custom-player-controls">
                    <button id="play-pause-btn" class="play-btn" aria-label="Play/Pause">
                       {/* Default Play Icon */}
                       <svg id="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                       {/* Hidden Pause Icon */}
                       <svg id="icon-pause" viewBox="0 0 24 24" style={{display: 'none'}}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </button>

                    <div class="time-indicator">
                      <span id="current-time">0:00</span> / <span id="duration">0:00</span>
                    </div>

                    <div class="volume-control">
                      <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                      <input type="range" id="volume-slider" class="volume-slider" min="0" max="1" step="0.01" value="1" />
                    </div>
                  </div>

                  <audio id="main-audio-player" crossorigin="anonymous">
                    <source src={audioFiles[0].url} id="audio-source" />
                  </audio>
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
                    <svg class="track-icon" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                    <div class="track-info">
                      <div class="track-title">{file.name}</div>
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

            const playBtn = document.getElementById('play-pause-btn');
            const iconPlay = document.getElementById('icon-play');
            const iconPause = document.getElementById('icon-pause');
            const timeCurrent = document.getElementById('current-time');
            const timeDuration = document.getElementById('duration');
            const volumeSlider = document.getElementById('volume-slider');

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

            // Formatting time
            function formatTime(seconds) {
              if (isNaN(seconds)) return "0:00";
              const m = Math.floor(seconds / 60);
              const s = Math.floor(seconds % 60);
              return m + ":" + (s < 10 ? "0" : "") + s;
            }

            // UI Updates
            function updatePlayBtnUI() {
               if (player.paused) {
                 iconPlay.style.display = 'block';
                 iconPause.style.display = 'none';
               } else {
                 iconPlay.style.display = 'none';
                 iconPause.style.display = 'block';
               }
            }

            playBtn.addEventListener('click', () => {
               if (player.paused) {
                 initAudio();
                 if (audioCtx && audioCtx.state === 'suspended') {
                   audioCtx.resume();
                 }
                 player.play().catch(e => console.log(e));
               } else {
                 player.pause();
               }
            });

            player.addEventListener('play', updatePlayBtnUI);
            player.addEventListener('pause', updatePlayBtnUI);

            player.addEventListener('timeupdate', () => {
              timeCurrent.textContent = formatTime(player.currentTime);
            });

            player.addEventListener('loadedmetadata', () => {
              timeDuration.textContent = formatTime(player.duration);
            });

            volumeSlider.addEventListener('input', (e) => {
              player.volume = e.target.value;
            });

            function initAudio() {
              if (isInitialized) return;

              audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              analyser = audioCtx.createAnalyser();
              sourceNode = audioCtx.createMediaElementSource(player);

              sourceNode.connect(analyser);
              analyser.connect(audioCtx.destination);

              analyser.fftSize = 512;
              const bufferLength = analyser.frequencyBinCount;
              dataArray = new Uint8Array(bufferLength);

              isInitialized = true;
              draw();
            }

            function draw() {
              requestAnimationFrame(draw);

              // Canvas responsive size
              const container = canvas.parentElement;
              canvas.width = container.clientWidth;
              canvas.height = container.clientHeight;

              if (!isInitialized) {
                // Draw flat line if not playing yet
                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = 'rgba(180, 251, 81, 0.5)';
                canvasCtx.beginPath();
                canvasCtx.moveTo(0, canvas.height / 2);
                canvasCtx.lineTo(canvas.width, canvas.height / 2);
                canvasCtx.stroke();
                return;
              }

              analyser.getByteTimeDomainData(dataArray);

              canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

              canvasCtx.lineWidth = 2;
              canvasCtx.strokeStyle = 'rgba(180, 251, 81, 0.8)';
              canvasCtx.beginPath();

              const sliceWidth = canvas.width * 1.0 / analyser.frequencyBinCount;
              let x = 0;

              for (let i = 0; i < analyser.frequencyBinCount; i++) {
                const v = dataArray[i] / 128.0;
                // Scale waveform to fit better in background
                const y = (v * canvas.height / 2) * 0.5 + (canvas.height / 4);

                if (i === 0) {
                  canvasCtx.moveTo(x, y);
                } else {
                  canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
              }

              canvasCtx.lineTo(canvas.width, canvas.height / 2);
              canvasCtx.stroke();
            }

            // Draw initial flat line
            draw();

            tracks.forEach(track => {
              track.addEventListener('click', function() {
                tracks.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const url = this.getAttribute('data-url');
                const title = this.getAttribute('data-title');

                source.src = url;
                currentTitle.textContent = title;

                player.load();

                initAudio();
                player.play().catch(e => console.log('Playback prevented:', e));
              });
            });

            player.addEventListener('ended', function() {
              const activeTrack = trackList.querySelector('.track-item.active');
              if (activeTrack && activeTrack.nextElementSibling) {
                activeTrack.nextElementSibling.click();
              } else {
                 // Reset play button state if at end of list
                 updatePlayBtnUI();
              }
            });
          });
        `}} />
      )}
    </>
  );
};
