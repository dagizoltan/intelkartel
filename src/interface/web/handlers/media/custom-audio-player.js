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
    this._time = 0; // for continuous slow movement of extra lines
  }

  connectedCallback() {
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
    this.player = this.querySelector('#main-audio-player');
    this.source = this.querySelector('#audio-source');
    this.trackList = this.querySelector('#track-list');
    this.tracks = this.querySelectorAll('.track-item');
    this.currentTitle = this.querySelector('#current-track-title');
    this.nowPlayingContainer = this.querySelector('#now-playing-container');

    this.canvas = this.querySelector('#oscillator-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.waveContainer = this.querySelector('#wave-container');
    }

    this.playBtn = this.querySelector('#play-pause-btn');
    this.iconPlay = this.querySelector('#icon-play');
    this.iconPause = this.querySelector('#icon-pause');

    this.timeCurrent = this.querySelector('#current-time');
    this.timeDuration = this.querySelector('#duration');

    this.seekSlider = this.querySelector('#seek-slider');
    this.seekProgress = this.querySelector('#seek-progress');

    this.volumeSlider = this.querySelector('#volume-slider');
    this.volumeProgress = this.querySelector('#volume-progress');

    if (!this.player) {
      console.warn('CustomAudioPlayer: No audio element found.');
      return;
    }

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

  initAudioContext() {
    if (this._isInitialized) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
      this._audioCtx = new AudioContext();
      this._analyser = this._audioCtx.createAnalyser();
      this._sourceNode = this._audioCtx.createMediaElementSource(this.player);

      this._sourceNode.connect(this._analyser);
      this._analyser.connect(this._audioCtx.destination);

      // Higher fftSize for a smoother, longer line
      this._analyser.fftSize = 1024;
      // We'll use frequency data as well for the glow scaling, but time domain for the line
      const bufferLength = this._analyser.frequencyBinCount;
      this._dataArray = new Uint8Array(bufferLength);
      this._freqArray = new Uint8Array(bufferLength);

      this._isInitialized = true;
    } catch (e) {
      console.warn("AudioContext initialization failed or blocked.", e);
    }
  }

  bindEvents() {
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

    this.player.addEventListener('play', () => this.updatePlayStateUI());
    this.player.addEventListener('pause', () => this.updatePlayStateUI());
    this.player.addEventListener('ended', () => this.handleTrackEnded());

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

    this.player.addEventListener('loadedmetadata', () => {
      if (this.timeDuration) {
        this.timeDuration.textContent = this.formatTime(this.player.duration);
      }
      if (this.seekSlider && this.seekProgress) {
        this.seekSlider.value = 0;
        this.seekProgress.style.width = '0%';
      }
    });

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

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        this.player.volume = e.target.value;
        this.updateVolumeUI();
      });
    }

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

  resizeCanvas() {
    if (!this.canvas || !this.waveContainer) return;
    // Over-sample canvas for retina displays for smoother lines
    const rect = this.waveContainer.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  drawWave() {
    if (!this.canvas || !this.ctx) return;

    this._animationId = requestAnimationFrame(() => this.drawWave());

    const rect = this.waveContainer.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Smooth clear with trail effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(0, 0, width, height);

    const centerY = height / 2;

    this._time += 0.02;

    if (!this._isInitialized || (!this._isPlaying && this.player.currentTime === 0)) {
      // Idle idle line when completely stopped
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeStyle = 'rgba(180, 251, 81, 0.3)';
      this.ctx.beginPath();
      this.ctx.moveTo(0, centerY);
      for(let x = 0; x < width; x += 10) {
        let yOffset = Math.sin(x * 0.01 + this._time) * 5;
        this.ctx.lineTo(x, centerY + yOffset);
      }
      this.ctx.stroke();
      return;
    }

    this._analyser.getByteTimeDomainData(this._dataArray);
    this._analyser.getByteFrequencyData(this._freqArray);

    // Calculate overall intensity to scale the visual
    let avgFreq = 0;
    for (let i = 0; i < this._freqArray.length; i++) {
      avgFreq += this._freqArray[i];
    }
    avgFreq /= this._freqArray.length;

    const intensity = Math.max(0.5, avgFreq / 50.0); // Boost amplitude dynamically

    const bufferLength = this._analyser.frequencyBinCount;
    // We only use part of the buffer for a cleaner, stretched look
    const visibleLength = Math.floor(bufferLength * 0.8);
    const sliceWidth = width * 1.0 / visibleLength;

    // Enhance by drawing 3 overlapping paths with slight opacity and y-offsets
    const numLines = 3;

    for (let j = 0; j < numLines; j++) {
      this.ctx.beginPath();

      let x = 0;

      this.ctx.lineWidth = j === 0 ? 2 : 1;

      if (j === 0) {
        this.ctx.strokeStyle = 'rgba(180, 251, 81, 0.9)'; // Bright center
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = 'rgba(180, 251, 81, 0.5)';
      } else {
        this.ctx.strokeStyle = 'rgba(180, 251, 81, 0.25)'; // Faded echoes
        this.ctx.shadowBlur = 0;
      }

      for (let i = 0; i < visibleLength; i++) {
        const v = this._dataArray[i] / 128.0;

        // Add artificial sine movement to the actual audio data for "atmosphere"
        const extraNoise = Math.sin(x * 0.01 + this._time * (1 + j * 0.5)) * (5 * j);

        // Scale the true waveform: (v - 1) centers it around 0. Apply intensity.
        const audioVariance = (v - 1) * height * 0.4 * intensity;

        const y = centerY + audioVariance + extraNoise;

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          // Smooth the curve with quadratic curve
          const prevV = this._dataArray[i-1] / 128.0;
          const prevAudioVariance = (prevV - 1) * height * 0.4 * intensity;
          const prevExtraNoise = Math.sin((x - sliceWidth) * 0.01 + this._time * (1 + j * 0.5)) * (5 * j);
          const prevY = centerY + prevAudioVariance + prevExtraNoise;

          const xc = (x - sliceWidth + x) / 2;
          const yc = (prevY + y) / 2;

          this.ctx.quadraticCurveTo(x - sliceWidth, prevY, xc, yc);
        }

        x += sliceWidth;
      }

      this.ctx.lineTo(width, centerY);
      this.ctx.stroke();
    }
  }
}

customElements.define('custom-audio-player', CustomAudioPlayer);
