let audioCtx = null;
let soundMuted = false;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

function playTone(freq, duration = 0.08, type = "sine", gainVal = 0.12, rampFreq = null) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (rampFreq) {
      osc.frequency.exponentialRampToValueAtTime(rampFreq, ctx.currentTime + duration);
    }
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  } catch (e) {
    console.warn("Audio playback failed", e);
  }
}

export const sound = {
  tick() { playTone(1180, 0.028, "square", 0.05); },
  pop()  { playTone(520, 0.07, "triangle", 0.11, 880); },
  ding() {
    playTone(880, 0.16, "sine", 0.13);
    setTimeout(() => playTone(1320, 0.22, "sine", 0.1), 90);
  },
  err()  { playTone(220, 0.16, "sawtooth", 0.07, 130); },
  win()  {
    [0, 110, 220, 400].forEach((delay, idx) => {
      setTimeout(() => playTone([523, 659, 784, 1047][idx], 0.34, "triangle", 0.12), delay);
    });
  },
  get muted() { return soundMuted; },
  set muted(val) { soundMuted = !!val; },
  toggle() {
    soundMuted = !soundMuted;
    return soundMuted;
  }
};

export function haptic(ms = 12) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  } catch {}
}

export function confetti({
  n = 140,
  colors = ["#1d4ed8", "#0f7b4f", "#b4690e", "#14140f"],
  origin = { x: 0.5, y: 0.38 },
  spread = 1,
  duration = 3200
} = {}) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;z-index:9999;pointer-events:none;";
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = canvas.width = window.innerWidth * dpr;
  const height = canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const particles = Array.from({ length: n }, () => ({
    x: origin.x * width + (Math.random() - 0.5) * 90 * dpr,
    y: origin.y * height,
    vx: (Math.random() - 0.5) * 15 * spread * dpr,
    vy: (-9 - Math.random() * 12) * spread * dpr,
    w: (5 + Math.random() * 7) * dpr,
    h: (7 + Math.random() * 11) * dpr,
    rot: Math.random() * 6.28,
    vr: (Math.random() - 0.5) * 0.34,
    col: colors[Math.floor(Math.random() * colors.length)],
    life: 1
  }));

  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.vy += 0.42 * dpr;
      p.vx *= 0.992;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life = Math.max(0, 1 - elapsed / duration);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 1.6)));
      ctx.restore();
    });

    if (elapsed < duration) {
      requestAnimationFrame(step);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(step);
}

export function mmss(seconds) {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const remSec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(remSec).padStart(2, "0")}`;
}

export async function createShareLink(bank) {
  const payload = { n: bank.name, q: bank.qs };
  const jsonStr = JSON.stringify(payload);
  const rawBytes = new TextEncoder().encode(jsonStr);

  try {
    if (typeof CompressionStream !== 'undefined') {
      const stream = new Blob([rawBytes]).stream().pipeThrough(new CompressionStream("deflate-raw"));
      const compressedBlob = await new Response(stream).blob();
      const buffer = await compressedBlob.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const b64 = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return `${window.location.origin}${window.location.pathname}#q=z${b64}`;
    }
  } catch (e) {
    console.warn("Deflate compression failed, falling back to plain b64", e);
  }

  const plainB64 = btoa(unescape(encodeURIComponent(jsonStr))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${window.location.origin}${window.location.pathname}#q=p${plainB64}`;
}

export async function parseShareLink(hashStr) {
  const match = String(hashStr).replace(/^#/, "").match(/(?:^|&)q=([^&]+)/);
  if (!match || match[1].length > 50000) return null;
  const algo = match[1][0];
  const b64Data = match[1].slice(1).replace(/-/g, "+").replace(/_/g, "/");

  const binary = atob(b64Data);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));

  let finalJsonStr = '';
  if (algo === 'z') {
    if (typeof DecompressionStream === 'undefined') throw new Error("Decompression not supported");
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    const reader = stream.getReader();
    const chunks = [];
    let totalLen = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalLen += value.length;
      if (totalLen > 1048576) throw new Error("Bank too large");
      chunks.push(value);
    }
    const merged = new Uint8Array(totalLen);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    finalJsonStr = new TextDecoder().decode(merged);
  } else if (algo === 'p') {
    finalJsonStr = decodeURIComponent(escape(binary));
  } else {
    throw new Error("Invalid algorithm");
  }

  const parsed = JSON.parse(finalJsonStr);
  if (!parsed || !parsed.n || !Array.isArray(parsed.q)) throw new Error("Malformed bank payload");
  return {
    id: "imported-" + Date.now(),
    name: parsed.n,
    qs: parsed.q
  };
}

export function renderPosterCanvas({
  title = "Practice Workbook",
  bankName = "Data Structures · Foundations",
  score = 100,
  right = 10,
  total = 10,
  spent = 60,
  byChap = {}
} = {}) {
  const canvas = document.createElement("canvas");
  const W = 720;
  const PAD = 48;
  const chapEntries = Object.entries(byChap);
  const H = 540 + chapEntries.length * 44;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#faf8f1";
  ctx.fillRect(0, 0, W, H);

  // Border frame
  ctx.strokeStyle = "#e0dbcc";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, W - 32, H - 32);

  // Header Title
  ctx.fillStyle = "#6a655a";
  ctx.font = "600 14px sans-serif";
  ctx.fillText("WORKBOOK · LEARNING REPORT", PAD, 64);

  ctx.fillStyle = "#1b1915";
  ctx.font = "700 28px sans-serif";
  ctx.fillText(bankName, PAD, 104);

  // Score Badge
  ctx.fillStyle = score >= 80 ? "#3d6b3a" : "#b03a2b";
  ctx.font = "700 72px sans-serif";
  ctx.fillText(String(score), PAD, 190);
  ctx.font = "600 24px sans-serif";
  ctx.fillText(`PTS  (${right}/${total} Correct in ${mmss(spent)})`, PAD + 140, 180);

  // Divider
  ctx.strokeStyle = "#e0dbcc";
  ctx.beginPath();
  ctx.moveTo(PAD, 220);
  ctx.lineTo(W - PAD, 220);
  ctx.stroke();

  // Chapter Breakdown
  ctx.fillStyle = "#1b1915";
  ctx.font = "600 16px sans-serif";
  ctx.fillText("Category Breakdown", PAD, 255);

  let curY = 290;
  chapEntries.forEach(([chap, stats]) => {
    ctx.fillStyle = "#6a655a";
    ctx.font = "500 14px sans-serif";
    ctx.fillText(chap, PAD, curY);

    const ratio = stats.n > 0 ? stats.r / stats.n : 0;
    const barW = 320;
    const barX = W - PAD - barW - 60;
    
    // Bar background
    ctx.fillStyle = "#ece8dc";
    ctx.fillRect(barX, curY - 12, barW, 14);

    // Bar fill
    ctx.fillStyle = "#2f4a6d";
    ctx.fillRect(barX, curY - 12, barW * ratio, 14);

    // Text ratio
    ctx.fillStyle = "#1b1915";
    ctx.font = "600 13px sans-serif";
    ctx.fillText(`${stats.r}/${stats.n}`, W - PAD - 45, curY);

    curY += 40;
  });

  // Footer
  ctx.fillStyle = "#a09a8b";
  ctx.font = "400 12px sans-serif";
  ctx.fillText("Workbook · Turn study materials into practice · 100% Client-Side", PAD, H - 36);

  return canvas;
}
