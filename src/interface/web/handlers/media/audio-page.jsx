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
            background: transparent;
          }

          custom-audio-player {
            display: block;
            width: 100%;
            height: 100%;
          }

          .audio-hero-container {
            width: 100%;
            max-width: var(--container-max-width, 1400px);
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr;
            gap: 0; /* Removed gap between player and list */
            height: 100%;
          }

          @media (min-width: 992px) {
            .audio-hero-container {
              grid-template-columns: 1fr 320px;
            }
          }

          .audio-main-col {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            min-height: 450px;
            padding-right: var(--md, 1rem); /* Slight padding to separate text from tracklist visually */
          }

          .audio-content-layer {
            position: relative;
            z-index: 2;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            /* Instead of taking 100% height, let it sit at the bottom naturally below the oscillator */
            pointer-events: none;
          }

          .empty-state {
            padding: var(--xl, 3rem);
            color: var(--text-muted, rgba(255,255,255,0.4));
            text-align: center;
            font-size: 1.1rem;
          }

          #main-audio-player {
            display: none;
          }

          .hidden {
            display: none !important;
          }
        `}</style>

        {hasAudio ? (
          <custom-audio-player>
            <div class="audio-hero-container">
              <div class="audio-main-col">
                {/* Oscillator now sits in standard document flow above the meta/controls */}
                <OscillatorBackground />

                <div class="audio-content-layer">
                  <PlayerMeta
                    title="Audio Intercepts"
                    description="Unredacted communications and situation reports."
                    currentTrackTitle="Select a track to play"
                  />
                  <PlayerControls />
                  <audio id="main-audio-player" crossorigin="anonymous">
                    <source src={audioFiles[0].url} id="audio-source" />
                  </audio>
                </div>
              </div>

              <DenseTrackList audioFiles={audioFiles} />
            </div>
          </custom-audio-player>
        ) : (
          <div class="audio-hero-container">
            <div class="audio-main-col">
              <div class="audio-content-layer">
                 <PlayerMeta
                    title="Audio Intercepts"
                    description="Unredacted communications and situation reports."
                    currentTrackTitle={null}
                  />
                 <div class="empty-state">No audio intercepts available at this time.</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {hasAudio && (
        <script type="module" src="/islands/custom-audio-player.js"></script>
      )}
    </>
  );
};
