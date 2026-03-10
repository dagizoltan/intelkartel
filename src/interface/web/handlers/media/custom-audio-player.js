class CustomAudioPlayer extends HTMLElement {
  constructor() {
    super();
    this._isSeeking = false;
    this._isPlaying = false;
    this._isInitialized = false;
    this._animationId = null;
    this._audioCtx = null;
    this._analyser = null;
    this._dataArray = null;
    this._sourceNode = null;
  }

  connectedCallback() {
    // Wait slightly to ensure children are fully parsed
    setTimeout(() => {
      this.initPlayer();
    }, 0);
  }

  disconnectedCallback() {
    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
    }
    if (this._audioCtx && this._audioCtx.state !== 'closed') {
      this._audioCtx.close();
    }
  }

  initPlayer() {
    // DOM Elements
    this.player = this.querySelector('#main-audio-player');
    this.source = this.querySelector('#audio-source');
    this.trackList = this.querySelector('#track-list');
    this.tracks = this.querySelectorAll('.track-item');
    this.currentTitle = this.querySelector('#current-track-title');
    this.nowPlayingContainer = this.querySelector('#now-playing-container');

    // Canvas
    this.canvas = this.querySelector('#oscillator-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.waveContainer = this.querySelector('#wave-container');
    }

    // Controls
    this.playBtn = this.querySelector('#play-pause-btn');
    this.iconPlay = this.querySelector('#icon-play');
    this.iconPause = this.querySelector('#icon-pause');

    this.timeCurrent = this.querySelector('#current-time');
    this.timeDuration = this.querySelector('#duration');

    // Progress
    this.seekSlider = this.querySelector('#seek-slider');
    this.seekProgress = this.querySelector('#seek-progress');

    // Volume
    this.volumeSlider = this.querySelector('#volume-slider');
    this.volumeProgress = this.querySelector('#volume-progress');

    if (!this.player) {
      console.warn('CustomAudioPlayer: No audio element found.');
      return;
    }

    // Initial State Setup
    if (this.tracks.length > 0) {
      const activeTrack = this.querySelector('.track-item.active') || this.tracks[0];
      if (this.currentTitle) {
        this.currentTitle.textContent = activeTrack.getAttribute('data-title');
      }
    }

    if (this.nowPlayingContainer) {
      this.nowPlayingContainer.classList.add('paused');
    }

    this.updateVolumeUI();
    this.bindEvents();

    if (this.canvas) {
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      // Draw initial flat line
      this.drawWave();
    }
  }

  initAudioContext() {
    if (this._isInitialized) return;

    // Create AudioContext only on first user interaction to bypass browser autoplay rules
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
      this._audioCtx = new AudioContext();
      this._analyser = this._audioCtx.createAnalyser();
      this._sourceNode = this._audioCtx.createMediaElementSource(this.player);

      this._sourceNode.connect(this._analyser);
      this._analyser.connect(this._audioCtx.destination);

      this._analyser.fftSize = 512;
      const bufferLength = this._analyser.frequencyBinCount;
      this._dataArray = new Uint8Array(bufferLength);

      this._isInitialized = true;
    } catch (e) {
      console.warn("AudioContext initialization failed or blocked.", e);
    }
  }

  bindEvents() {
    // Play/Pause Button
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        if (this.player.paused) {
          this.initAudioContext();
          if (this._audioCtx && this._audioCtx.state === 'suspended') {
            this._audioCtx.resume();
          }
          this.player.play().catch(e => console.error('Playback prevented:', e));
        } else {
          this.player.pause();
        }
      });
    }

    // Player State Events
    this.player.addEventListener('play', () => this.updatePlayStateUI());
    this.player.addEventListener('pause', () => this.updatePlayStateUI());
    this.player.addEventListener('ended', () => this.handleTrackEnded());

    // Time Update Event
    this.player.addEventListener('timeupdate', () => {
      if (!this._isSeeking && this.timeCurrent && this.seekSlider && this.seekProgress) {
        this.timeCurrent.textContent = this.formatTime(this.player.currentTime);
        if (this.player.duration) {
          const percentage = (this.player.currentTime / this.player.duration) * 100;
          this.seekSlider.value = percentage;
          this.seekProgress.style.width = percentage + '%';
        }
      }
    });

    // Metadata Loaded Event
    this.player.addEventListener('loadedmetadata', () => {
      if (this.timeDuration) {
        this.timeDuration.textContent = this.formatTime(this.player.duration);
      }
      if (this.seekSlider && this.seekProgress) {
        this.seekSlider.value = 0;
        this.seekProgress.style.width = '0%';
      }
    });

    // Progress Seek Events
    if (this.seekSlider) {
      this.seekSlider.addEventListener('input', (e) => {
        this._isSeeking = true;
        const val = e.target.value;
        if (this.seekProgress) this.seekProgress.style.width = val + '%';
        if (this.player.duration && this.timeCurrent) {
          this.timeCurrent.textContent = this.formatTime((val / 100) * this.player.duration);
        }
      });

      this.seekSlider.addEventListener('change', (e) => {
        this._isSeeking = false;
        if (this.player.duration) {
          this.player.currentTime = (e.target.value / 100) * this.player.duration;
        }
      });
    }

    // Volume Events
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        this.player.volume = e.target.value;
        this.updateVolumeUI();
      });
    }

    // Tracklist Events
    if (this.tracks) {
      this.tracks.forEach(track => {
        track.addEventListener('click', (e) => {
          this.tracks.forEach(t => t.classList.remove('active'));
          e.currentTarget.classList.add('active');

          const url = e.currentTarget.getAttribute('data-url');
          const title = e.currentTarget.getAttribute('data-title');

          if (this.source) this.source.src = url;
          if (this.currentTitle) this.currentTitle.textContent = title;

          this.player.load();
          this.initAudioContext();
          if (this._audioCtx && this._audioCtx.state === 'suspended') {
            this._audioCtx.resume();
          }
          this.player.play().catch(err => console.error('Playback prevented:', err));
        });
      });
    }
  }

  handleTrackEnded() {
    const activeTrack = this.querySelector('.track-item.active');
    if (activeTrack && activeTrack.nextElementSibling) {
      activeTrack.nextElementSibling.click();
    } else {
      // End of list, reset UI
      this.updatePlayStateUI();
      if (this.seekSlider && this.seekProgress) {
        this.seekSlider.value = 0;
        this.seekProgress.style.width = '0%';
      }
      if (this.timeCurrent) {
        this.timeCurrent.textContent = this.formatTime(0);
      }
      this.player.currentTime = 0;
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  updateVolumeUI() {
    if (!this.volumeSlider || !this.volumeProgress) return;
    const val = this.player.volume;
    this.volumeSlider.value = val;
    this.volumeProgress.style.width = (val * 100) + '%';
  }

  updatePlayStateUI() {
    this._isPlaying = !this.player.paused;

    if (this.iconPlay && this.iconPause) {
      if (this._isPlaying) {
        this.iconPlay.classList.add('hidden');
        this.iconPause.classList.remove('hidden');
        if (this.playBtn) this.playBtn.classList.add('is-playing');
        if (this.nowPlayingContainer) this.nowPlayingContainer.classList.remove('paused');
        if (this.waveContainer) this.waveContainer.classList.add('is-playing');
      } else {
        this.iconPlay.classList.remove('hidden');
        this.iconPause.classList.add('hidden');
        if (this.playBtn) this.playBtn.classList.remove('is-playing');
        if (this.nowPlayingContainer) this.nowPlayingContainer.classList.add('paused');
        if (this.waveContainer) this.waveContainer.classList.remove('is-playing');
      }
    }
  }

  // --- Canvas Web Audio Visualization ---
  resizeCanvas() {
    if (!this.canvas || !this.waveContainer) return;
    this.canvas.width = this.waveContainer.clientWidth;
    this.canvas.height = this.waveContainer.clientHeight;
  }

  drawWave() {
    if (!this.canvas || !this.ctx) return;

    this._animationId = requestAnimationFrame(() => this.drawWave());

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const centerY = this.canvas.height / 2;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // If not initialized or not playing, draw a flat/pulsing aesthetic line
    if (!this._isInitialized || !this._isPlaying) {
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'rgba(180, 251, 81, 0.4)';
      this.ctx.beginPath();
      this.ctx.moveTo(0, centerY);
      this.ctx.lineTo(width, centerY);
      this.ctx.stroke();
      return;
    }

    // Get true audio data
    this._analyser.getByteTimeDomainData(this._dataArray);

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'rgba(180, 251, 81, 0.8)';
    this.ctx.beginPath();

    const bufferLength = this._analyser.frequencyBinCount;
    const sliceWidth = width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = this._dataArray[i] / 128.0;
      // Scale waveform to fit better in background (0.5 times the actual height variance)
      const y = (v * height / 2) * 0.5 + (height / 4);

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.lineTo(width, centerY);
    this.ctx.stroke();
  }
}

customElements.define('custom-audio-player', CustomAudioPlayer);
