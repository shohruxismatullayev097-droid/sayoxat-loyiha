// Cinematic Web Audio Ambient Soundscape & Location Climate Engine
class SoundscapeEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.isPlaying = false;
        this.oscillators = [];
        this.windGain = null;
        this.windFilter = null;
        this.currentLocation = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Lowpass filter for warm cinematic tone
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.setValueAtTime(440, this.ctx.currentTime);
        this.filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
        this.filter.connect(this.masterGain);

        // Warm harmonic chord (A minor 9th / ambient meditative drone)
        const freqs = [110, 164.81, 220, 261.63, 329.63];
        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            osc.detune.setValueAtTime((i - 2) * 4, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.12 / freqs.length, this.ctx.currentTime);

            osc.connect(gain);
            gain.connect(this.filter);
            osc.start();
            this.oscillators.push(osc);
        });

        // Atmospheric soft wind generator (buffer noise)
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let j = 0; j < bufferSize; j++) {
            const white = Math.random() * 2 - 1;
            output[j] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[j];
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        this.windFilter = this.ctx.createBiquadFilter();
        this.windFilter.type = 'bandpass';
        this.windFilter.frequency.setValueAtTime(280, this.ctx.currentTime);
        this.windFilter.Q.setValueAtTime(2.2, this.ctx.currentTime);

        this.windGain = this.ctx.createGain();
        this.windGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

        whiteNoise.connect(this.windFilter);
        this.windFilter.connect(this.windGain);
        this.windGain.connect(this.masterGain);
        whiteNoise.start();
    }

    toggle() {
        if (!this.ctx) {
            this.init();
        }

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const now = this.ctx.currentTime;
        if (!this.isPlaying) {
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.linearRampToValueAtTime(0.48, now + 1.2);
            this.isPlaying = true;
        } else {
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.linearRampToValueAtTime(0, now + 0.8);
            this.isPlaying = false;
        }

        return this.isPlaying;
    }

    // Weather & Location Audio Adaptation
    setLocationWeather(locationId) {
        if (!this.ctx || !this.isPlaying || !this.windFilter || !this.windGain) return;
        if (this.currentLocation === locationId) return;
        this.currentLocation = locationId;

        const now = this.ctx.currentTime;

        switch (locationId) {
            case 'samarqand': // Night: calm, quiet ambient, low wind
                this.windFilter.frequency.setTargetAtTime(220, now, 0.8);
                this.windGain.gain.setTargetAtTime(0.03, now, 0.8);
                this.filter.frequency.setTargetAtTime(380, now, 0.8);
                break;
            case 'buxoro': // Desert: dry whistling desert wind
                this.windFilter.frequency.setTargetAtTime(480, now, 0.8);
                this.windGain.gain.setTargetAtTime(0.08, now, 0.8);
                this.filter.frequency.setTargetAtTime(520, now, 0.8);
                break;
            case 'xiva': // Ancient city: warm golden breeze
                this.windFilter.frequency.setTargetAtTime(340, now, 0.8);
                this.windGain.gain.setTargetAtTime(0.05, now, 0.8);
                this.filter.frequency.setTargetAtTime(460, now, 0.8);
                break;
            case 'toshkent': // City evening: gentle urban air
                this.windFilter.frequency.setTargetAtTime(300, now, 0.8);
                this.windGain.gain.setTargetAtTime(0.04, now, 0.8);
                this.filter.frequency.setTargetAtTime(440, now, 0.8);
                break;
            case 'chimyon': // Alpine mountains: high altitude howling mountain breeze
                this.windFilter.frequency.setTargetAtTime(650, now, 0.8);
                this.windGain.gain.setTargetAtTime(0.12, now, 0.8);
                this.filter.frequency.setTargetAtTime(620, now, 0.8);
                break;
            default:
                break;
        }
    }

    setSpeedFlight(speedRatio = 0) {
        if (!this.ctx || !this.filter || !this.windGain) return;
        const now = this.ctx.currentTime;
        const targetFreq = 420 + speedRatio * 400;
        this.filter.frequency.setTargetAtTime(targetFreq, now, 0.15);
        this.windGain.gain.setTargetAtTime(0.045 + speedRatio * 0.08, now, 0.15);
    }
}

export const soundscape = new SoundscapeEngine();
