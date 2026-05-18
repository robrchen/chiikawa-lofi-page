// =============================================
//  lofi-music.js — Tone.js v15 with style presets
// =============================================

// ── 1. 視覺化與 UI 控制 ───
const VIZ = document.getElementById('visualizer');

if (VIZ && VIZ.children.length === 0) {
    const BAR_COUNT = 18;
    const peaks = [6, 10, 14, 18, 22, 20, 16, 24, 20, 14, 18, 22, 16, 12, 18, 14, 10, 8];
    for (let i = 0; i < BAR_COUNT; i++) {
        const b = document.createElement('div');
        b.className = 'bar';
        b.style.setProperty('--peak', peaks[i] + 'px');
        b.style.setProperty('--dur', (.5 + Math.random() * .7).toFixed(2) + 's');
        b.style.animationDelay = (Math.random() * .5).toFixed(2) + 's';
        VIZ.appendChild(b);
    }
}

function setVizActive(on) {
    if (!VIZ) return;
    VIZ.querySelectorAll('.bar').forEach(b => {
        if (on) b.classList.add('active');
        else b.classList.remove('active');
    });
    const disc = document.getElementById('vinyl-disc');
    if (disc) disc.classList.toggle('spinning', on);
}

function onVolInput(el) {
    const v = el.value;
    el.style.setProperty('--pct', v);
    const display = document.getElementById('vol-display');
    if (display) display.textContent = v;
    if (engine && engine.isInitialized) {
        engine.setVolume(v);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('volume-slider');
    if (slider) {
        slider.style.setProperty('--pct', slider.value);
        const display = document.getElementById('vol-display');
        if (display) display.textContent = slider.value;
    }

    const styleSelect = document.getElementById('music-style-select');
    if (styleSelect) {
        styleSelect.value = engine.styleName;
        styleSelect.addEventListener('change', () => engine.setStyle(styleSelect.value));
    }
});

// ── 2. Style Presets / Chord Packs / Drum Patterns ───
const CHORD_PACKS = {
    mellowMinor: {
        defaultChord: 'Cm9',
        chords: {
            Cm9: ['C3', 'Eb3', 'G3', 'Bb3', 'D4'],
            Fm9: ['F2', 'Ab2', 'C3', 'Eb3', 'G3'],
            Bb13: ['Bb2', 'D3', 'F3', 'Ab3', 'G4'],
            EbMaj9: ['Eb3', 'G3', 'Bb3', 'D4', 'F4'],
            AbMaj7: ['Ab2', 'C3', 'Eb3', 'G3'],
            G7alt: ['G2', 'B2', 'F3', 'Ab3', 'Eb4']
        },
        transitions: {
            Cm9: { Fm9: 0.4, AbMaj7: 0.4, EbMaj9: 0.2 },
            Fm9: { Bb13: 0.6, Cm9: 0.4 },
            Bb13: { EbMaj9: 0.7, Cm9: 0.3 },
            EbMaj9: { AbMaj7: 0.6, Cm9: 0.4 },
            AbMaj7: { Fm9: 0.5, G7alt: 0.5 },
            G7alt: { Cm9: 1.0 }
        },
        scales: {
            Cm9: ['C4', 'Eb4', 'G4', 'Bb4', 'D5', 'G5'],
            Fm9: ['F4', 'Ab4', 'C5', 'Eb5', 'G5'],
            Bb13: ['Bb3', 'D4', 'F4', 'Ab4', 'C5', 'G5'],
            EbMaj9: ['Eb4', 'G4', 'Bb4', 'D5', 'F5'],
            AbMaj7: ['Ab3', 'C4', 'Eb4', 'G4', 'C5'],
            G7alt: ['G3', 'B3', 'F4', 'Ab4', 'Eb5']
        }
    },
    sunnyMajor: {
        defaultChord: 'FMaj9',
        chords: {
            FMaj9: ['F3', 'A3', 'C4', 'E4', 'G4'],
            G13: ['G2', 'B2', 'F3', 'A3', 'E4'],
            Em7: ['E3', 'G3', 'B3', 'D4'],
            Am9: ['A2', 'C3', 'E3', 'G3', 'B3'],
            Dm9: ['D3', 'F3', 'A3', 'C4', 'E4'],
            C6: ['C3', 'E3', 'G3', 'A3']
        },
        transitions: {
            FMaj9: { G13: 0.35, Em7: 0.25, Dm9: 0.4 },
            G13: { C6: 0.5, Am9: 0.5 },
            Em7: { Am9: 0.7, FMaj9: 0.3 },
            Am9: { Dm9: 0.45, G13: 0.45, FMaj9: 0.1 },
            Dm9: { G13: 0.55, FMaj9: 0.45 },
            C6: { FMaj9: 0.75, Dm9: 0.25 }
        },
        scales: {
            FMaj9: ['F4', 'A4', 'C5', 'E5', 'G5'],
            G13: ['G4', 'B4', 'D5', 'E5', 'F5', 'A5'],
            Em7: ['E4', 'G4', 'B4', 'D5', 'G5'],
            Am9: ['A4', 'C5', 'E5', 'G5', 'B5'],
            Dm9: ['D4', 'F4', 'A4', 'C5', 'E5'],
            C6: ['C4', 'E4', 'G4', 'A4', 'C5']
        }
    },
    nightJazz: {
        defaultChord: 'Dm11',
        chords: {
            Dm11: ['D3', 'F3', 'A3', 'C4', 'G4'],
            G13b9: ['G2', 'B2', 'F3', 'Ab3', 'E4'],
            CMaj9: ['C3', 'E3', 'G3', 'B3', 'D4'],
            Am11: ['A2', 'C3', 'E3', 'G3', 'D4'],
            Fm9: ['F2', 'Ab2', 'C3', 'Eb3', 'G3']
        },
        transitions: {
            Dm11: { G13b9: 0.65, Am11: 0.35 },
            G13b9: { CMaj9: 0.8, Fm9: 0.2 },
            CMaj9: { Am11: 0.45, Dm11: 0.4, Fm9: 0.15 },
            Am11: { Dm11: 0.7, G13b9: 0.3 },
            Fm9: { CMaj9: 1.0 }
        },
        scales: {
            Dm11: ['D4', 'F4', 'A4', 'C5', 'E5', 'G5'],
            G13b9: ['G3', 'B3', 'F4', 'Ab4', 'E5'],
            CMaj9: ['C4', 'E4', 'G4', 'B4', 'D5'],
            Am11: ['A3', 'C4', 'E4', 'G4', 'D5'],
            Fm9: ['F4', 'Ab4', 'C5', 'Eb5', 'G5']
        }
    }
};

const DRUM_PATTERNS = {
    pocket: {
        kick: { 0: 1, 9: 0.2, 10: 0.4 },
        snare: { 4: 1, 12: 1, 15: 0.3 },
        hatEven: 1,
        hatOdd: 0.8,
        snareLazyMax: 0.02
    },
    bounce: {
        kick: { 0: 1, 3: 0.45, 6: 0.25, 10: 0.75, 14: 0.35 },
        snare: { 4: 1, 11: 0.25, 12: 1, 15: 0.45 },
        hatEven: 1,
        hatOdd: 0.95,
        snareLazyMax: 0.012
    },
    sparse: {
        kick: { 0: 1, 10: 0.35 },
        snare: { 4: 0.95, 12: 1 },
        hatEven: 0.75,
        hatOdd: 0.3,
        snareLazyMax: 0.03
    }
};

const STYLE_PRESETS = {
    study: {
        label: 'Study Lo-fi',
        bpm: 84,
        swing: 0.4,
        chordPack: 'mellowMinor',
        drumPattern: 'pocket',
        masterEQ: { low: 2, mid: -1, high: -6 },
        vinylDb: -30,
        drumDb: -2,
        padDb: -14,
        bassDb: -2,
        pianoDb: -5,
        padFilter: 1200,
        pianoChance: 0.6,
        pianoRestStartStep: 16,
        bassGhostChance: 0.5
    },
    upbeat: {
        label: 'Upbeat Cafe',
        bpm: 98,
        swing: 0.25,
        chordPack: 'sunnyMajor',
        drumPattern: 'bounce',
        masterEQ: { low: 1, mid: 0, high: -3 },
        vinylDb: -34,
        drumDb: 0,
        padDb: -12,
        bassDb: -3,
        pianoDb: -4,
        padFilter: 1800,
        pianoChance: 0.78,
        pianoRestStartStep: 24,
        bassGhostChance: 0.7
    },
    midnight: {
        label: 'Midnight Jazz',
        bpm: 72,
        swing: 0.5,
        chordPack: 'nightJazz',
        drumPattern: 'sparse',
        masterEQ: { low: 2, mid: -2, high: -8 },
        vinylDb: -26,
        drumDb: -5,
        padDb: -16,
        bassDb: -1,
        pianoDb: -8,
        padFilter: 900,
        pianoChance: 0.38,
        pianoRestStartStep: 12,
        bassGhostChance: 0.25
    }
};

function weightedPick(probabilities, fallback) {
    const rand = Math.random();
    let cumulative = 0;
    for (const [key, prob] of Object.entries(probabilities)) {
        cumulative += prob;
        if (rand <= cumulative) return key;
    }
    return fallback;
}

function rootFromChord(chordName, fallback = 'C') {
    const rootMatch = chordName.match(/^[A-G][b#]?/);
    return rootMatch ? rootMatch[0] : fallback;
}

// ── 3. 音樂引擎模組 ────
class AudioMaster {
    constructor() {
        this.masterVolume = new Tone.Volume(0).toDestination();
        this.masterCompressor = new Tone.Compressor({ threshold: -12, ratio: 3, attack: 0.1, release: 0.5 });
        this.masterEQ = new Tone.EQ3({ low: 2, mid: -1, high: -6 });
        this.masterEQ.connect(this.masterCompressor);
        this.masterCompressor.connect(this.masterVolume);
        this.input = this.masterEQ;
    }

    setVolume(value) {
        const safeValue = Math.max(Number(value), 1);
        const targetDb = Tone.gainToDb(safeValue / 100);
        this.masterVolume.volume.rampTo(targetDb, 0.1);
    }

    setStyle(style) {
        this.masterEQ.low.rampTo(style.masterEQ.low, 0.5);
        this.masterEQ.mid.rampTo(style.masterEQ.mid, 0.5);
        this.masterEQ.high.rampTo(style.masterEQ.high, 0.5);
    }
}

class VinylNoise {
    constructor(destination, getStyle) {
        this.getStyle = getStyle;
        this.noise = new Tone.Noise('pink');
        this.filter = new Tone.Filter(350, 'lowpass');
        this.volume = new Tone.Volume(-30);
        this.noise.chain(this.filter, this.volume, destination);
    }

    start() { this.noise.start(); }
    stop() { this.noise.stop(); }

    setStyle(style) {
        this.volume.volume.rampTo(style.vinylDb, 0.5);
    }
}

class LofiDrumGroove {
    constructor(destination, getStyle) {
        this.getStyle = getStyle;
        this.drumBus = new Tone.Volume(-2);
        this.bitcrusher = new Tone.BitCrusher(6);
        this.lowpass = new Tone.Filter(3500, 'lowpass');
        this.drumBus.chain(this.bitcrusher, this.lowpass, destination);

        this.kick = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 4,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1 }
        }).connect(this.drumBus);
        this.kick.volume.value = 2;

        this.snare = new Tone.NoiseSynth({
            noise: { type: 'pink' },
            envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 }
        });
        this.snareFilter = new Tone.Filter(1500, 'highpass').connect(this.drumBus);
        this.snare.connect(this.snareFilter);

        this.hihat = new Tone.MetalSynth({
            frequency: 200,
            envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }).connect(this.drumBus);
        this.hihat.volume.value = -12;

        this.step = 0;
        this.loop = null;
    }

    start() {
        this.stop();
        this.loop = new Tone.Loop(time => {
            this.playStep(time);
            this.step = (this.step + 1) % 16;
        }, '16n').start(0);
    }

    stop() {
        if (this.loop) {
            this.loop.stop();
            this.loop.dispose();
            this.loop = null;
        }
        this.step = 0;
    }

    setStyle(style) {
        this.drumBus.volume.rampTo(style.drumDb, 0.5);
    }

    playStep(time) {
        const style = this.getStyle();
        const pattern = DRUM_PATTERNS[style.drumPattern] || DRUM_PATTERNS.pocket;
        const kickChance = pattern.kick[this.step] || 0;
        const snareChance = pattern.snare[this.step] || 0;

        if (kickChance && Math.random() < kickChance) {
            this.kick.triggerAttackRelease('C1', '8n', time, Math.min(1, 0.55 + kickChance * 0.45));
        }

        if (snareChance && Math.random() < snareChance) {
            const lazyTiming = time + Math.random() * pattern.snareLazyMax;
            const dur = this.step === 15 ? '32n' : '16n';
            this.snare.triggerAttackRelease(dur, lazyTiming, Math.min(1, 0.25 + snareChance * 0.75));
        }

        const isEvenHat = this.step % 2 === 0;
        const hatChance = isEvenHat ? pattern.hatEven : pattern.hatOdd;
        if (Math.random() < hatChance) {
            const velocity = isEvenHat ? 0.65 + Math.random() * 0.3 : 0.25 + Math.random() * 0.25;
            this.hihat.triggerAttackRelease('32n', time, velocity);
        }
    }
}

class LofiGenerativePad {
    constructor(destination, getStyle) {
        this.getStyle = getStyle;
        this.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.02, decay: 0.5, sustain: 0.4, release: 1.2 }
        });

        this.chorus = new Tone.Chorus(0.1, 2.5, 0.5).start();
        this.reverb = new Tone.Reverb({ decay: 2.5, wet: 0.25 });
        this.filter = new Tone.Filter(1200, 'lowpass');
        this.highpass = new Tone.Filter(200, 'highpass');
        this.volume = new Tone.Volume(-14);
        this.synth.chain(this.chorus, this.reverb, this.filter, this.highpass, this.volume, destination);

        this.currentChordName = 'Cm9';
        this.loop = null;
    }

    get chordPack() {
        const style = this.getStyle();
        return CHORD_PACKS[style.chordPack] || CHORD_PACKS.mellowMinor;
    }

    start() {
        this.stop();
        this.loop = new Tone.Loop(time => {
            const pack = this.chordPack;
            this.currentChordName = weightedPick(pack.transitions[this.currentChordName], pack.defaultChord);
            const notes = pack.chords[this.currentChordName] || pack.chords[pack.defaultChord];
            this.synth.triggerAttackRelease(notes, '8n', time, 0.8);

            if (Math.random() > 0.3) {
                this.synth.triggerAttackRelease(notes, '8n', time + Tone.Time('4n').toSeconds() * 1.5, 0.5);
            }
        }, '1m').start(0);
    }

    stop() {
        if (this.loop) {
            this.loop.stop();
            this.loop.dispose();
            this.loop = null;
        }
        this.synth.releaseAll();
    }

    setStyle(style) {
        const pack = CHORD_PACKS[style.chordPack] || CHORD_PACKS.mellowMinor;
        this.currentChordName = pack.defaultChord;
        this.volume.volume.rampTo(style.padDb, 0.5);
        this.filter.frequency.rampTo(style.padFilter, 0.5);
    }
}

class LofiSubBass {
    constructor(destination, padInstance, getStyle) {
        this.pad = padInstance;
        this.getStyle = getStyle;
        this.synth = new Tone.MonoSynth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.8 },
            filter: { Q: 1, type: 'lowpass', rolloff: -24 },
            filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5, baseFrequency: 60, octaves: 3 }
        });

        this.dist = new Tone.Distortion(0.2);
        this.volume = new Tone.Volume(-2);
        this.synth.chain(this.dist, this.volume, destination);
        this.step = 0;
        this.loop = null;
    }

    start() {
        this.stop();
        this.loop = new Tone.Loop(time => {
            const style = this.getStyle();
            const currentChord = this.pad ? this.pad.currentChordName : 'Cm9';
            const bassNote = rootFromChord(currentChord) + '1';

            if (this.step % 4 === 0) {
                this.synth.triggerAttackRelease(bassNote, '8n', time, 1);
            } else if (this.step === 7 && Math.random() < style.bassGhostChance) {
                this.synth.triggerAttackRelease(bassNote, '16n', time, 0.5);
            }

            this.step = (this.step + 1) % 16;
        }, '16n').start(0);
    }

    stop() {
        if (this.loop) {
            this.loop.stop();
            this.loop.dispose();
            this.loop = null;
        }
        this.step = 0;
        this.synth.triggerRelease();
    }

    setStyle(style) {
        this.volume.volume.rampTo(style.bassDb, 0.5);
    }
}

class LofiContextAwarePiano {
    constructor(destination, padInstance, getStyle) {
        this.pad = padInstance;
        this.getStyle = getStyle;
        this.synth = new Tone.PolySynth(Tone.FMSynth, {
            harmonicity: 1.5,
            modulationIndex: 2,
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.05, decay: 1.5, sustain: 0.2, release: 2 },
            modulation: { type: 'sine' }
        });

        this.vibrato = new Tone.Vibrato({ frequency: 3.5, depth: 0.08 });
        this.pingpong = new Tone.PingPongDelay('8n.', 0.2);
        this.reverb = new Tone.Reverb({ decay: 3, wet: 0.3 });
        this.volume = new Tone.Volume(-5);
        this.synth.chain(this.vibrato, this.pingpong, this.reverb, this.volume, destination);

        this.step = 0;
        this.loop = null;
    }

    start() {
        this.stop();
        this.loop = new Tone.Loop(time => {
            this.playStep(time);
            this.step = (this.step + 1) % 32;
        }, '8n').start(0);
    }

    stop() {
        if (this.loop) {
            this.loop.stop();
            this.loop.dispose();
            this.loop = null;
        }
        this.step = 0;
        this.synth.releaseAll();
    }

    setStyle(style) {
        this.volume.volume.rampTo(style.pianoDb, 0.5);
    }

    playStep(time) {
        const style = this.getStyle();
        if (this.step >= style.pianoRestStartStep) return;
        if (Math.random() > style.pianoChance) return;

        const pack = CHORD_PACKS[style.chordPack] || CHORD_PACKS.mellowMinor;
        const currentChord = this.pad ? this.pad.currentChordName : pack.defaultChord;
        const scale = pack.scales[currentChord] || pack.scales[pack.defaultChord];
        const note1 = scale[Math.floor(Math.random() * scale.length)];
        const velocity = 0.5 + Math.random() * 0.4;

        if (Math.random() < 0.2) {
            const note2 = scale[Math.floor(Math.random() * scale.length)];
            this.synth.triggerAttackRelease([note1, note2], '8n', time, velocity);
        } else {
            this.synth.triggerAttackRelease(note1, '8n', time, velocity);
        }
    }
}

class LofiEngine {
    constructor() {
        this.isInitialized = false;
        this.isPlaying = false;
        this.master = null;
        this.instruments = {};
        this.styleName = 'study';
    }

    getStyle() {
        return STYLE_PRESETS[this.styleName] || STYLE_PRESETS.study;
    }

    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();

            this.master = new AudioMaster();
            const getStyle = () => this.getStyle();
            this.instruments.vinyl = new VinylNoise(this.master.input, getStyle);
            this.instruments.drums = new LofiDrumGroove(this.master.input, getStyle);
            this.instruments.pad = new LofiGenerativePad(this.master.input, getStyle);
            this.instruments.bass = new LofiSubBass(this.master.input, this.instruments.pad, getStyle);
            this.instruments.piano = new LofiContextAwarePiano(this.master.input, this.instruments.pad, getStyle);

            this.isInitialized = true;
            this.applyStyle();
            console.log('Lo-fi Engine ready with style presets');
        } catch (error) {
            console.error('Tone.js 初始化失敗', error);
        }
    }

    setStyle(styleName) {
        if (!STYLE_PRESETS[styleName]) {
            console.warn(`未知曲風：${styleName}`);
            return;
        }

        this.styleName = styleName;
        if (!this.isInitialized) return;

        this.applyStyle();
        const status = document.getElementById('music-status');
        if (status && this.isPlaying) {
            status.textContent = `🎵 ${this.getStyle().label} 播放中`;
        }
    }

    applyStyle() {
        const style = this.getStyle();
        Tone.Transport.bpm.rampTo(style.bpm, 0.5);
        Tone.Transport.swing = style.swing;
        Tone.Transport.swingSubdivision = '16n';

        this.master.setStyle(style);
        Object.values(this.instruments).forEach(instrument => {
            if (typeof instrument.setStyle === 'function') instrument.setStyle(style);
        });
    }

    async togglePlay(currentVolumeValue) {
        if (!this.isInitialized) await this.init();
        if (this.isPlaying) this.stop();
        else this.play(currentVolumeValue);
        return this.isPlaying;
    }

    play(volume) {
        this.master.setVolume(volume);
        this.applyStyle();
        this.instruments.vinyl.start();
        this.instruments.drums.start();
        this.instruments.pad.start();
        this.instruments.bass.start();
        this.instruments.piano.start();
        Tone.Transport.start();
        this.isPlaying = true;
        this._gcInterval = setInterval(() => {
    if (!this.isPlaying) return;
    // 定期 release 所有殘留音符
    this.instruments.pad.synth.releaseAll();
    this.instruments.piano.synth.releaseAll();
}, 5 * 60 * 1000); // 每 5 分鐘
    }

    stop() {
        this.master.masterVolume.volume.rampTo(-Infinity, 0.5);
        setTimeout(() => {
            Tone.Transport.pause();
            Object.values(this.instruments).forEach(instrument => instrument.stop());
            this.isPlaying = false;
        }, 500);
        clearInterval(this._gcInterval);
    }

    setVolume(value) {
        if (this.master) this.master.setVolume(value);
    }
}

const engine = new LofiEngine();

async function toggleMusic() {
    const slider = document.getElementById('volume-slider');
    const currentVolume = slider ? slider.value : 50;
    const isNowPlaying = await engine.togglePlay(currentVolume);

    setVizActive(isNowPlaying);

    const btnLabel = document.getElementById('music-btn-label');
    const icon = document.querySelector('#music-toggle-btn .material-symbols-outlined');
    const status = document.getElementById('music-status');

    if (isNowPlaying) {
        if (btnLabel) btnLabel.textContent = '暫停';
        if (icon) icon.textContent = 'pause';
        if (status) status.textContent = `🎵 ${engine.getStyle().label} 播放中`;

        if (typeof initiatePlayerDonate === 'function') {
            initiatePlayerDonate('點播陪伴音樂', 30, '謝謝音樂陪伴，大家一起深呼吸！', 3, 'music');
        }
    } else {
        if (btnLabel) btnLabel.textContent = '播放背景音樂';
        if (icon) icon.textContent = 'play_arrow';
        if (status) status.textContent = '⏸ 已停止';
    }
}

function setMusicStyle(styleName) {
    engine.setStyle(styleName);
}
