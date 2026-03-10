import { PlayerMeta } from './components/PlayerMeta.jsx';
import { OscillatorBackground } from './components/OscillatorBackground.jsx';
import { PlayerControls } from './components/PlayerControls.jsx';
import { DenseTrackList } from './components/DenseTrackList.jsx';

export const AudioPage = ({ audioFiles }) => {
  const hasAudio = audioFiles && audioFiles.length > 0;

  return (
    <>
      <section class="hero audio-hero">
        <style>{`
          .audio-hero {
            padding: var(--xl, 3rem) var(--md, 1rem);
            min-height: calc(100vh - var(--bottom-nav-height, 60px) - 80px);
            display: flex;
            align-items: stretch;
            background: transparent; /* Remove old solid backgrounds */
          }

          .audio-hero-container {
            width: 100%;
            max-width: var(--container-max-width, 1400px);
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--xl, 3rem);
            height: 100%;
          }

          @media (min-width: 992px) {
            .audio-hero-container {
              grid-template-columns: 1fr 320px; /* Slim tracklist column */
            }
          }

          .audio-main-col {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            min-height: 450px;
            /* Completely removed background surface/card */
          }

          /* Content above visualizer */
          .audio-content-layer {
            position: relative;
            z-index: 2;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            height: 100%;
            pointer-events: none; /* Make container pass-through */
          }

          .empty-state {
            padding: var(--xl, 3rem);
            color: var(--text-muted, rgba(255,255,255,0.4));
            text-align: center;
            font-size: 1.1rem;
          }

          /* Hidden native audio element */
          #main-audio-player {
            display: none;
          }
        `}</style>

        <div class="audio-hero-container">
          <div class="audio-main-col">
            {hasAudio && <OscillatorBackground />}

            <div class="audio-content-layer">
              <PlayerMeta
                title="Audio Intercepts"
                description="Unredacted communications and situation reports."
                currentTrackTitle={hasAudio ? "Select a track to play" : null}
              />

              {hasAudio ? (
                <>
                  <PlayerControls />
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
            <DenseTrackList audioFiles={audioFiles} />
          )}
        </div>
      </section>

      {hasAudio && (
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const player = document.getElementById('main-audio-player');
            const source = document.getElementById('audio-source');
            const trackList = document.getElementById('track-list');
            const tracks = trackList.querySelectorAll('.track-item');
            const currentTitle = document.getElementById('current-track-title');
            const nowPlayingContainer = document.getElementById('now-playing-container');

            // Controls
            const playBtn = document.getElementById('play-pause-btn');
            const iconPlay = document.getElementById('icon-play');
            const iconPause = document.getElementById('icon-pause');

            const timeCurrent = document.getElementById('current-time');
            const timeDuration = document.getElementById('duration');

            // Progress
            const seekSlider = document.getElementById('seek-slider');
            const seekProgress = document.getElementById('seek-progress');

            // Volume
            const volumeSlider = document.getElementById('volume-slider');
            const volumeProgress = document.getElementById('volume-progress');

            // State
            let isSeeking = false;

            // Initial UI Setup
            if (tracks.length > 0) {
              currentTitle.textContent = tracks[0].getAttribute('data-title');
            }
            nowPlayingContainer.classList.add('paused');

            // Initialize volume UI
            updateVolumeUI();

            // Utilities
            function formatTime(seconds) {
              if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
              const m = Math.floor(seconds / 60);
              const s = Math.floor(seconds % 60);
              return m + ":" + (s < 10 ? "0" : "") + s;
            }

            function updateVolumeUI() {
              const val = player.volume;
              volumeSlider.value = val;
              volumeProgress.style.width = (val * 100) + '%';
            }

            function updatePlayBtnUI() {
               if (player.paused) {
                 iconPlay.style.display = 'block';
                 iconPause.style.display = 'none';
                 playBtn.classList.remove('is-playing');
                 nowPlayingContainer.classList.add('paused');
               } else {
                 iconPlay.style.display = 'none';
                 iconPause.style.display = 'block';
                 playBtn.classList.add('is-playing');
                 nowPlayingContainer.classList.remove('paused');
               }
            }

            // Event Listeners: Controls
            playBtn.addEventListener('click', () => {
               if (player.paused) {
                 player.play().catch(e => console.log('Playback prevented:', e));
               } else {
                 player.pause();
               }
            });

            // Event Listeners: Player State
            player.addEventListener('play', updatePlayBtnUI);
            player.addEventListener('pause', updatePlayBtnUI);

            player.addEventListener('timeupdate', () => {
              if (!isSeeking) {
                timeCurrent.textContent = formatTime(player.currentTime);
                if (player.duration) {
                  const percentage = (player.currentTime / player.duration) * 100;
                  seekSlider.value = percentage;
                  seekProgress.style.width = percentage + '%';
                }
              }
            });

            player.addEventListener('loadedmetadata', () => {
              timeDuration.textContent = formatTime(player.duration);
              seekSlider.value = 0;
              seekProgress.style.width = '0%';
            });

            // Event Listeners: Progress Seek
            seekSlider.addEventListener('input', (e) => {
              isSeeking = true;
              const val = e.target.value;
              seekProgress.style.width = val + '%';
              if (player.duration) {
                timeCurrent.textContent = formatTime((val / 100) * player.duration);
              }
            });

            seekSlider.addEventListener('change', (e) => {
              isSeeking = false;
              if (player.duration) {
                player.currentTime = (e.target.value / 100) * player.duration;
              }
            });

            // Event Listeners: Volume
            volumeSlider.addEventListener('input', (e) => {
              player.volume = e.target.value;
              updateVolumeUI();
            });

            // Event Listeners: Tracklist
            tracks.forEach(track => {
              track.addEventListener('click', function() {
                tracks.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const url = this.getAttribute('data-url');
                const title = this.getAttribute('data-title');

                source.src = url;
                currentTitle.textContent = title;

                player.load();
                player.play().catch(e => console.log('Playback prevented:', e));
              });
            });

            // Auto-advance
            player.addEventListener('ended', function() {
              const activeTrack = trackList.querySelector('.track-item.active');
              if (activeTrack && activeTrack.nextElementSibling) {
                activeTrack.nextElementSibling.click();
              } else {
                 // Reset play button state if at end of list
                 updatePlayBtnUI();
                 seekSlider.value = 0;
                 seekProgress.style.width = '0%';
                 timeCurrent.textContent = formatTime(0);
                 player.currentTime = 0;
              }
            });
          });
        `}} />
      )}
    </>
  );
};
