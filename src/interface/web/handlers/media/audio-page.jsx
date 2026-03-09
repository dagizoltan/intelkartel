import { Hero } from "../../components/Hero.jsx";

export const AudioPage = ({ audioFiles }) => {
  const hasAudio = audioFiles && audioFiles.length > 0;

  return (
    <>
      <Hero
        title="Audio Intercepts"
        description="Unredacted communications and situation reports."
      />
    <section class="audio-page">
      <style>{`
        .audio-page {
          padding: 4rem 0;
        }
        .audio-player-container {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 2rem;
          max-width: 800px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .main-player {
          width: 100%;
          margin-bottom: 2rem;
          outline: none;
        }
        .track-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 400px;
          overflow-y: auto;
          border-top: 1px solid var(--border-color);
        }
        .track-item {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.2s;
        }
        .track-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .track-item.active {
          background-color: rgba(255, 255, 255, 0.1);
          border-left: 4px solid var(--accent-color);
        }
        .track-icon {
          margin-right: 1rem;
          fill: var(--text-muted);
        }
        .track-item.active .track-icon {
          fill: var(--accent-color);
        }
        .track-info {
          flex: 1;
        }
        .track-title {
          font-weight: 500;
          margin-bottom: 0.25rem;
          word-break: break-all;
        }
        .track-meta {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }
        /* Custom Audio Player Styling */
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
      <div class="container">
        <div class="audio-player-container">
          {hasAudio ? (
            <>
              <div class="now-playing" style={{ marginBottom: '1rem', textAlign: 'left' }}>
                <h3 id="current-track-title" style={{ margin: 0, color: 'var(--accent-color)' }}>Select a track to play</h3>
              </div>

              <audio id="main-audio-player" class="main-player" controls preload="metadata">
                <source src={audioFiles[0].url} id="audio-source" />
                Your browser does not support the audio element.
              </audio>

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

              <script dangerouslySetInnerHTML={{ __html: `
                document.addEventListener('DOMContentLoaded', function() {
                  const player = document.getElementById('main-audio-player');
                  const source = document.getElementById('audio-source');
                  const trackList = document.getElementById('track-list');
                  const tracks = trackList.querySelectorAll('.track-item');
                  const currentTitle = document.getElementById('current-track-title');

                  if (tracks.length > 0) {
                    currentTitle.textContent = tracks[0].getAttribute('data-title');
                  }

                  tracks.forEach(track => {
                    track.addEventListener('click', function() {
                      // Remove active class from all
                      tracks.forEach(t => t.classList.remove('active'));

                      // Add active class to clicked
                      this.classList.add('active');

                      // Update player source
                      const url = this.getAttribute('data-url');
                      const title = this.getAttribute('data-title');

                      source.src = url;
                      currentTitle.textContent = title;

                      // Reload and play
                      player.load();
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
            </>
          ) : (
            <div class="empty-state">No audio intercepts available at this time.</div>
          )}
        </div>
      </div>
    </section>
    </>
  );
};
