/**
 * Audio Notification Service for Kitchen / Staff Alerts
 * Uses Web Audio API to synthesize crisp, pleasant, and audible bell chimes
 * without external audio asset dependencies or CORS/network latency.
 */

export class SoundService {
  private static audioCtx: AudioContext | null = null;
  private static STORAGE_KEY = 'elaf_admin_sound_muted';

  /**
   * Safe AudioContext initialization & auto-resume on user gesture
   */
  private static getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  /**
   * Check if sound is muted in local storage
   */
  static isSoundMuted(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  /**
   * Set sound mute state
   */
  static setSoundMuted(muted: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, muted ? 'true' : 'false');
  }

  /**
   * Unlock AudioContext on any user interaction (to satisfy browser autoplay policy)
   */
  static unlockAudio(): void {
    try {
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Plays a 3-bell sequence ("Ding-Dong-Chime") to alert kitchen staff
   * of a new incoming order.
   */
  static playNewOrderChime(): void {
    if (this.isSoundMuted()) return;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Note frequencies (G5 -> C6 -> E6 harmonic chime)
      const notes = [
        { freq: 783.99, delay: 0.0, duration: 0.22, gain: 0.35 },
        { freq: 1046.5, delay: 0.18, duration: 0.26, gain: 0.4 },
        { freq: 1318.51, delay: 0.38, duration: 0.55, gain: 0.45 },
      ];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.7, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const startTime = ctx.currentTime + 0.02;

      notes.forEach(({ freq, delay, duration, gain }) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Sine wave for smooth melodic chime, with a touch of harmonic warmth
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime + delay);

        // Bell envelope: fast attack, natural exponential decay
        const noteStart = startTime + delay;
        noteGain.gain.setValueAtTime(0.001, noteStart);
        noteGain.gain.exponentialRampToValueAtTime(gain, noteStart + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(noteStart);
        osc.stop(noteStart + duration + 0.05);
      });
    } catch (err) {
      console.warn('Could not play order chime:', err);
    }
  }

  /**
   * Plays a quick confirmation beep for status changes
   */
  static playConfirmChime(): void {
    if (this.isSoundMuted()) return;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }
}
