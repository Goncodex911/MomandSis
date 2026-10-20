/* =========================================================
   AUDIO.JS - ROMANTIC SOUND ENGINE & MUSIC CONTROLLER
   - Web Audio Synth for romantic chords & gentle melodies
   - Interactive chimes, bloom chords, wax cracking effects
   - Vinyl turntable disk toggle
   ========================================================= */

class RomanticMusicEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.synthTimer = null;
    this.step = 0;
    this.ytPlayer = null;
    this.ytReady = false;

    // Frequencies (Hz)
    this.notes = {
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50
    };

    // Melody progression: "Young and Beautiful" / Romantic Ballad
    this.melodySequence = [
      { chord: ['A3', 'E4', 'C5'], melody: 'E4', duration: 1.1 },
      { chord: ['A3', 'C5'], melody: 'A4', duration: 1.1 },
      { chord: ['C4', 'G4', 'E5'], melody: 'G4', duration: 1.1 },
      { chord: ['C4', 'E5'], melody: 'E4', duration: 1.1 },
      { chord: ['F3', 'C4', 'A4'], melody: 'A4', duration: 1.1 },
      { chord: ['F3', 'A4'], melody: 'C5', duration: 1.1 },
      { chord: ['G3', 'D4', 'B4'], melody: 'B4', duration: 1.1 },
      { chord: ['G3', 'B4'], melody: 'G4', duration: 1.1 },
      { chord: ['A3', 'E4', 'C5'], melody: 'C5', duration: 0.9 },
      { chord: ['A3'], melody: 'B4', duration: 0.9 },
      { chord: ['A3', 'C5'], melody: 'A4', duration: 1.3 },
      { chord: ['F3', 'C4'], melody: 'F4', duration: 0.9 },
      { chord: ['F3'], melody: 'A4', duration: 0.9 },
      { chord: ['G3', 'D4'], melody: 'G4', duration: 1.4 },
      { chord: ['A3', 'E4'], melody: 'C5', duration: 0.9 },
      { chord: ['A3'], melody: 'B4', duration: 0.9 },
      { chord: ['A3', 'C5'], melody: 'A4', duration: 1.3 },
      { chord: ['F3', 'C4'], melody: 'A4', duration: 0.9 },
      { chord: ['G3', 'D4'], melody: 'B4', duration: 0.9 },
      { chord: ['A3', 'E4', 'C5'], melody: 'A4', duration: 2.0 }
    ];

    this.discElement = document.getElementById('music-disc');
    this.labelElement = document.getElementById('music-status-text');
    this.controllerElement = document.getElementById('music-controller');

    if (this.controllerElement) {
      this.controllerElement.addEventListener('click', () => this.toggle());
    }

    this.initYouTubePlayer();
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initYouTubePlayer() {
    window.onYouTubeIframeAPIReady = () => {
      try {
        this.ytPlayer = new YT.Player('youtube-player', {
          height: '1',
          width: '1',
          videoId: 'o_1aF54DO60', // Lana Del Rey - Young and Beautiful
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: 'o_1aF54DO60'
          },
          events: {
            onReady: () => {
              this.ytReady = true;
              if (this.isPlaying) {
                this.ytPlayer.playVideo();
              }
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) {
                this.isPlaying = true;
                if (this.discElement) this.discElement.classList.add('playing');
                if (this.labelElement) this.labelElement.textContent = 'Nhạc: Đang phát 🎵';
              }
            }
          }
        });
      } catch (err) {
        console.warn('YouTube API init fallback to synth:', err);
      }
    };
  }

  playTone(freq, type = 'sine', startTime = 0, duration = 0.5, volume = 0.15) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playStep() {
    if (!this.isPlaying || !this.audioCtx) return;

    const current = this.melodySequence[this.step % this.melodySequence.length];
    const now = this.audioCtx.currentTime;

    // Hợp âm piano nền
    if (current.chord) {
      current.chord.forEach(noteName => {
        if (this.notes[noteName]) {
          this.playTone(this.notes[noteName], 'triangle', now, current.duration * 1.5, 0.06);
        }
      });
    }

    // Giai điệu chính
    if (current.melody && this.notes[current.melody]) {
      this.playTone(this.notes[current.melody], 'sine', now + 0.04, current.duration * 0.9, 0.12);
    }

    this.step++;
    this.synthTimer = setTimeout(() => {
      this.playStep();
    }, current.duration * 1000);
  }

  start() {
    this.ensureContext();
    this.isPlaying = true;

    if (this.discElement) this.discElement.classList.add('playing');
    if (this.labelElement) this.labelElement.textContent = 'Nhạc: Đang phát 🎵';

    // Thử YouTube trước nếu sẵn sàng
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.playVideo();
        return;
      } catch (e) {
        console.log('Chuyển sang synth offline');
      }
    }

    // Fallback Web Audio Synth
    if (!this.synthTimer) {
      this.playStep();
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.discElement) this.discElement.classList.remove('playing');
    if (this.labelElement) this.labelElement.textContent = 'Bật nhạc 🎵';

    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch (e) {}
    }

    if (this.synthTimer) {
      clearTimeout(this.synthTimer);
      this.synthTimer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.start();
    }
  }

  // Âm thanh vỡ/bật con dấu sáp
  playWaxCrack() {
    this.ensureContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.playTone(220, 'sine', now, 0.15, 0.2);
    this.playTone(440, 'triangle', now + 0.05, 0.25, 0.18);
    this.playTone(659.25, 'sine', now + 0.12, 0.4, 0.15);
  }

  // Âm thanh gõ chữ nhẹ nhàng
  playTypeTick() {
    this.ensureContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const freq = 600 + Math.random() * 300;
    this.playTone(freq, 'sine', now, 0.04, 0.02);
  }

  // Âm thanh nở hoa bùng cháy rạng rỡ (Harp / Celestial Bloom Chords)
  playBloomChord() {
    this.ensureContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const chord = [392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
    chord.forEach((freq, idx) => {
      this.playTone(freq, 'sine', now + idx * 0.08, 1.2, 0.18 - idx * 0.02);
      this.playTone(freq * 0.5, 'triangle', now + idx * 0.08, 1.5, 0.08);
    });
  }

  // Âm thanh chuông gió nhẹ nhàng
  playWindChime() {
    this.ensureContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [880, 1046.5, 1318.5, 1567.98].forEach((f, i) => {
      this.playTone(f, 'sine', now + i * 0.06, 0.6, 0.08);
    });
  }
}

// Global instance
window.romanticAudio = new RomanticMusicEngine();
