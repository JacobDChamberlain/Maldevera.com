// Tiny synthesized SFX for the booth (Web Audio, no asset files). Footsteps
// while walking + pickup/put-down blips on open/close. Real samples can be
// dropped in later by swapping these functions. The AudioContext must be
// resumed from a user gesture (we call resume() on entering the booth / tapping).

let ctx = null;

function getCtx() {
    if (typeof window === 'undefined') return null;
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
    }
    return ctx;
}

export function resume() {
    const c = getCtx();
    if (c && c.state === 'suspended') c.resume();
}

// Short filtered noise burst = a soft footstep.
export function footstep() {
    const c = getCtx();
    if (!c || c.state !== 'running') return;
    const dur = 0.11;
    const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    }
    const src = c.createBufferSource();
    src.buffer = buffer;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 280 + Math.random() * 140;
    const g = c.createGain();
    g.gain.value = 0.16;
    src.connect(lp).connect(g).connect(c.destination);
    src.start();
}

// A short pitch-swept blip.
function blip(f1, f2, dur, vol) {
    const c = getCtx();
    if (!c || c.state !== 'running') return;
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(f1, t);
    o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
}

export function pickup() { blip(440, 880, 0.12, 0.18); }   // rising — "grab"
export function putdown() { blip(660, 300, 0.14, 0.16); }  // falling — "set back"
