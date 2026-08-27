/**
 * XellCodee - Gamified Web Audio Synthesizer
 * Menggunakan Web Audio API untuk menghasilkan sound effect (SFX) tanpa dependensi file MP3.
 */

window.SoundManager = (function () {
    let audioCtx = null;
    const STORAGE_KEY = 'xellcodee_sound_muted';

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function isMuted() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }

    function setMuted(muted) {
        localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
        updateSoundIcons();
    }

    function toggleMute() {
        const next = !isMuted();
        setMuted(next);
        return next;
    }

    function updateSoundIcons() {
        const muted = isMuted();
        document.querySelectorAll('.sound-toggle-icon').forEach(el => {
            el.className = `sound-toggle-icon fas ${muted ? 'fa-volume-mute text-slate-500' : 'fa-volume-up text-xc-emerald'}`;
        });
        document.querySelectorAll('.sound-toggle-text').forEach(el => {
            el.innerText = muted ? 'Suara: Nonaktif' : 'Suara: Aktif';
        });
    }

    /**
     * Memainkan not nada tunggal dengan ADSR envelope halus
     */
    function playTone(freq, startTime, duration, type = 'sine', gainVal = 0.15) {
        const ctx = getAudioContext();
        if (!ctx || isMuted()) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);

            // Envelope: Attack -> Decay -> Release
            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
        } catch (e) {
            console.warn('Audio playTone error:', e);
        }
    }

    /**
     * Chime Ceria saat Jawaban Benar (Duolingo Style)
     */
    function playSuccessSound() {
        const ctx = getAudioContext();
        if (!ctx || isMuted()) return;

        const now = ctx.currentTime;
        // Triad nada ceria: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
        playTone(523.25, now, 0.12, 'triangle', 0.18);
        playTone(659.25, now + 0.08, 0.12, 'triangle', 0.18);
        playTone(783.99, now + 0.16, 0.14, 'triangle', 0.2);
        playTone(1046.50, now + 0.24, 0.28, 'triangle', 0.22);
    }

    /**
     * Feedback Lembut saat Output Salah
     */
    function playErrorSound() {
        const ctx = getAudioContext();
        if (!ctx || isMuted()) return;

        const now = ctx.currentTime;
        // 2 nada turun lembut: D#4 (311Hz) -> C4 (261Hz)
        playTone(311.13, now, 0.12, 'sine', 0.15);
        playTone(261.63, now + 0.1, 0.2, 'sine', 0.15);
    }

    /**
     * Suara Klik UI Tactile
     */
    function playClickSound() {
        const ctx = getAudioContext();
        if (!ctx || isMuted()) return;

        const now = ctx.currentTime;
        playTone(800, now, 0.04, 'sine', 0.08);
    }

    /**
     * Fanfare saat Modul Terakhir / Semua Modul Selesai
     */
    function playLevelUpSound() {
        const ctx = getAudioContext();
        if (!ctx || isMuted()) return;

        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((n, i) => {
            playTone(n, now + (i * 0.09), 0.22, 'triangle', 0.18);
        });
    }

    // Listener interaksi pertama untuk unlock audio context browser
    document.addEventListener('click', () => {
        if (!audioCtx) getAudioContext();
    }, { once: true });

    document.addEventListener('DOMContentLoaded', () => {
        updateSoundIcons();
    });

    return {
        isMuted,
        setMuted,
        toggleMute,
        updateSoundIcons,
        playSuccessSound,
        playErrorSound,
        playClickSound,
        playLevelUpSound
    };
})();
