class CustomAudioPlayer extends HTMLElement {
  constructor() {
    super();
    this._isSeeking = false;
    this._isPlaying = false;
    this._isInitialized = false;
    this._animationId = null;
    this._time = 0;
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
      this.drawWave();
    }
  }

  bindEvents() {
    // Play/Pause Button
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        if (this.player.paused) {
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

  // --- Canvas Wave Animation ---
  resizeCanvas() {
    if (!this.canvas || !this.waveContainer) return;
    this.canvas.width = this.waveContainer.clientWidth;
    this.canvas.height = this.waveContainer.clientHeight;
  }

  drawWave() {
    if (!this.canvas || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const centerY = this.canvas.height / 2;
    const width = this.canvas.width;
    const numLines = 3;

    for (let j = 0; j < numLines; j++) {
      this.ctx.beginPath();

      let speed = this._isPlaying ? 0.05 + (j * 0.01) : 0.005 + (j * 0.001);
      let baseAmplitude = this._isPlaying ? this.canvas.height * 0.25 : this.canvas.height * 0.05;
      let frequency = 0.01 + (j * 0.005);

      this.ctx.lineWidth = j === 0 ? 2 : 1;
      this.ctx.strokeStyle = j === 0
        ? 'rgba(180, 251, 81, 0.8)'
        : 'rgba(180, 251, 81, 0.3)';

      for (let x = 0; x < width; x++) {
        let noise = this._isPlaying ? Math.sin(x * 0.05 + this._time * 2) * 5 : 0;
        let mod = Math.sin(x * 0.005 + this._time) * 0.5 + 0.5;
        let amplitude = baseAmplitude * mod;

        let yOffset = Math.sin(x * frequency + this._time * speed + j * 2) * amplitude + noise;
        let y = centerY + yOffset;

        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.stroke();
    }

    this._time += this._isPlaying ? 0.1 : 0.02;
    this._animationId = requestAnimationFrame(() => this.drawWave());
  }
}

customElements.define('custom-audio-player', CustomAudioPlayer);
