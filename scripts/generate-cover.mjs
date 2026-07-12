#!/usr/bin/env node
/**
 * generate-cover.mjs — procedural blog cover generator.
 *
 * Makes soft, defocused "translucent petal / silk" gradient art in the
 * spirit of OpenAI's blog cards: high-key, airy, one hue family with a
 * bright bloom and a saturated vein. The gradient is painted with pure math
 * (seeded value-noise), then dithered + encoded to a small WebP with sharp
 * (dithering is what keeps smooth gradients from banding once compressed).
 *
 * Usage:
 *   node scripts/generate-cover.mjs                       # random palette + seed
 *   node scripts/generate-cover.mjs --palette periwinkle  # pick a palette
 *   node scripts/generate-cover.mjs --seed 42             # reproducible
 *   node scripts/generate-cover.mjs --count 5             # a batch to choose from
 *   node scripts/generate-cover.mjs --out public/images/blog/my-post.webp
 *   node scripts/generate-cover.mjs --list                # list palettes
 *
 * Options:
 *   --palette <name|random>   default: random
 *   --seed <int>              default: random
 *   --size <px>               output width, default 1600 (16:9 unless --square)
 *   --square                  square output instead of 16:9
 *   --format <webp|png>       default: webp
 *   --quality <1-100>         webp quality, default 82
 *   --count <n>               generate N images (random seeds), default 1
 *   --out <path>              output file (single image only)
 *   --outdir <dir>            output directory, default public/images/blog
 */

import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

/* ------------------------------- palettes ------------------------------- */
// Each palette: ramp stops (deep -> mid -> light) + a saturated "vein" pop.
const PALETTES = {
  periwinkle: { ramp: ["#4a5bef", "#8494ff", "#d3d9ff"], pop: "#7fd8ff" },
  azure:      { ramp: ["#1f6fe0", "#7fb3f5", "#dcefff"], pop: "#17c6e6" },
  skygreen:   { ramp: ["#3f82e6", "#93c2f2", "#eef5ff"], pop: "#79c94a" },
  mint:       { ramp: ["#2fc78c", "#9be8c4", "#ebfff5"], pop: "#c2f24a" },
  teallime:   { ramp: ["#15b4c6", "#69ddd2", "#e9fff8"], pop: "#8ada4c" },
  blush:      { ramp: ["#e77fa8", "#f3b9cf", "#fdeef4"], pop: "#f8bd8a" },
  lavender:   { ramp: ["#7d6cf0", "#b9aef7", "#f1eeff"], pop: "#f0a6d6" },
  amber:      { ramp: ["#e79a2f", "#f3cf93", "#fff6e6"], pop: "#ef7d7d" },
};

/* --------------------------------- args --------------------------------- */
function parseArgs(argv) {
  const a = { size: 1600, count: 1, outdir: "public/images/blog" };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--list") a.list = true;
    else if (k === "--square") a.square = true;
    else if (k === "--palette") a.palette = argv[++i];
    else if (k === "--seed") a.seed = parseInt(argv[++i], 10);
    else if (k === "--size") a.size = parseInt(argv[++i], 10);
    else if (k === "--format") a.format = argv[++i];
    else if (k === "--quality") a.quality = parseInt(argv[++i], 10);
    else if (k === "--count") a.count = parseInt(argv[++i], 10);
    else if (k === "--out") a.out = argv[++i];
    else if (k === "--outdir") a.outdir = argv[++i];
  }
  return a;
}

/* ------------------------------- utilities ------------------------------ */
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* value noise + fractal Brownian motion, seeded */
function makeNoise(rand) {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (rand() * (i + 1)) | 0;
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const val = (xi, yi) => perm[(perm[xi & 255] + yi) & 255] / 255;

  function noise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = smoother(xf);
    const v = smoother(yf);
    const v00 = val(xi, yi);
    const v10 = val(xi + 1, yi);
    const v01 = val(xi, yi + 1);
    const v11 = val(xi + 1, yi + 1);
    return lerp(lerp(v00, v10, u), lerp(v01, v11, u), v);
  }

  function fbm(x, y, octaves = 4) {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += amp * noise(x * freq, y * freq);
      norm += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return sum / norm;
  }

  return { noise, fbm };
}

/* ------------------------------- generate ------------------------------- */
function rampColor(stops, t) {
  // stops: array of [r,g,b]; t in [0,1] across evenly spaced stops
  const n = stops.length - 1;
  const scaled = clamp(t, 0, 1) * n;
  const i = Math.min(n - 1, Math.floor(scaled));
  const f = scaled - i;
  return [
    lerp(stops[i][0], stops[i + 1][0], f),
    lerp(stops[i][1], stops[i + 1][1], f),
    lerp(stops[i][2], stops[i + 1][2], f),
  ];
}

function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Draped-silk / overlapping-petal art. Composites translucent shapes with
 * DEFINED soft edges over either a saturated or a light "ground", aligns the
 * sheet folds to one drape direction, and lays a bright specular crease on
 * top — the defining highlight you see in the OpenAI cards.
 */
function renderField(paletteName, seed, fieldSize) {
  const pal = PALETTES[paletteName];
  const ramp = pal.ramp.map(hexToRgb);
  const light = ramp[ramp.length - 1];
  const mid = ramp[Math.min(1, ramp.length - 1)];
  const deep = ramp[0];
  const pop = hexToRgb(pal.pop);
  const white = [255, 255, 255];
  const rand = mulberry32(seed);
  const { fbm } = makeNoise(rand);
  const rnd = (a, b) => a + rand() * (b - a);
  const pick = (arr) => arr[(rand() * arr.length) | 0];

  // Ground: half the references are a saturated field with bright folds
  // (art_card, Frame), half are a light field with saturated petals (broadcom).
  const darkGround = rand() < 0.5;
  const canvas = darkGround
    ? (rand() < 0.7 ? mid : deep).slice()
    : [lerp(light[0], 255, 0.2), lerp(light[1], 255, 0.2), lerp(light[2], 255, 0.2)];

  // strong coherent warp -> flowing drape; edges stay defined via low feather
  const warpAmt = 0.22 + rand() * 0.22;
  const wf = 0.7 + rand() * 0.6;
  const o1x = rand() * 10, o1y = rand() * 10;
  const o2x = rand() * 10, o2y = rand() * 10;

  // one dominant drape direction; fold-sheets align loosely to it
  const drift = rand() * Math.PI * 2;

  // every shape gets a gentle internal gradient (co = lighter sheen) so it
  // reads like light falling across a surface, not a flat fill
  const sheen = (color) => ({
    co: [lerp(color[0], 255, 0.28), lerp(color[1], 255, 0.28), lerp(color[2], 255, 0.28)],
    gx: rnd(-1, 1),
    gy: rnd(-1, 1),
    gmix: rnd(0.22, 0.42),
  });

  const sheet = (color, opacity, feather, jitter = 0.35) => {
    const ang = drift + (rand() - 0.5) * 2 * jitter;
    return {
      kind: "sheet",
      ca: Math.cos(ang),
      sa: Math.sin(ang),
      pos: rnd(0.28, 0.72),
      feather,
      color,
      opacity,
      ...sheen(color),
      ewarp: rnd(0.12, 0.26),
      es: rnd(1.2, 2.6),
      eox: rand() * 10,
      eoy: rand() * 10,
    };
  };
  const lobe = (color, opacity, feather, rMin = 0.24, rMax = 0.5) => {
    const rot = rand() * Math.PI;
    return {
      kind: "lobe",
      cx: rnd(0.05, 0.95),
      cy: rnd(0.05, 0.95),
      radius: rnd(rMin, rMax),
      // elongate into a petal, not a disc
      aspect: rnd(0.45, 0.9),
      rc: Math.cos(rot),
      rs: Math.sin(rot),
      feather,
      color,
      opacity,
      ...sheen(color),
      // stronger, higher-frequency edge wobble -> irregular organic edge
      ewarp: rnd(0.14, 0.28),
      es: rnd(1.6, 3.2),
      eox: rand() * 10,
      eoy: rand() * 10,
    };
  };

  // Back-to-front. Low feathers = defined edges; a couple softer for depth.
  const layers = [];
  if (darkGround) {
    layers.push(sheet(light, rnd(0.5, 0.7), rnd(0.05, 0.1))); // broad light fold
    if (rand() < 0.6) layers.push(lobe(deep, rnd(0.4, 0.6), rnd(0.05, 0.1))); // shadow pocket
    layers.push(sheet(white, rnd(0.5, 0.68), rnd(0.02, 0.045), 0.28)); // crisp bright fold
    layers.push(lobe(pop, rnd(0.5, 0.72), rnd(0.02, 0.045), 0.18, 0.4)); // accent
    if (rand() < 0.5) layers.push(lobe(light, rnd(0.4, 0.6), rnd(0.03, 0.06), 0.16, 0.34));
  } else {
    layers.push(sheet(pick([deep, mid]), rnd(0.55, 0.75), rnd(0.05, 0.11), 0.45)); // color fold
    layers.push(lobe(mid, rnd(0.55, 0.75), rnd(0.02, 0.05))); // petal
    layers.push(lobe(pick([deep, mid]), rnd(0.5, 0.72), rnd(0.02, 0.045))); // petal
    layers.push(lobe(pop, rnd(0.55, 0.75), rnd(0.02, 0.04), 0.18, 0.4)); // accent petal
    layers.push(lobe(white, rnd(0.5, 0.7), rnd(0.02, 0.05), 0.14, 0.3)); // bloom petal
  }

  // defining specular crease (the bright fold highlight), aligned to the drape
  const hasSpec = rand() < 0.85;
  const specAng = drift + (rand() - 0.5) * 0.5;
  const spec = {
    ca: Math.cos(specAng),
    sa: Math.sin(specAng),
    pos: rnd(0.3, 0.7),
    w: rnd(0.022, 0.045),
    warp: rnd(0.1, 0.2), // curves the crease along the drape
    es: rnd(1.0, 1.8),
    eox: rand() * 10,
    eoy: rand() * 10,
    strength: rnd(0.32, 0.55),
  };

  const bloomX = rnd(0.15, 0.85);
  const bloomY = rnd(0.12, 0.62);
  const bloomR = rnd(0.28, 0.46);

  // very low-frequency luminance drift so flat areas breathe (photographic)
  const tox = rand() * 10, toy = rand() * 10;
  const tAmp = 0.07 + rand() * 0.05;

  const rgb = new Float32Array(fieldSize * fieldSize * 3);

  for (let y = 0; y < fieldSize; y++) {
    for (let x = 0; x < fieldSize; x++) {
      const nx = x / fieldSize;
      const ny = y / fieldSize;

      const wx = nx + warpAmt * (fbm(nx * wf + o1x, ny * wf + o1y, 3) - 0.5);
      const wy = ny + warpAmt * (fbm(nx * wf + o2x, ny * wf + o2y, 3) - 0.5);

      let r = canvas[0];
      let g = canvas[1];
      let b = canvas[2];

      for (const L of layers) {
        const wob =
          L.ewarp * (fbm(wx * L.es + L.eox, wy * L.es + L.eoy, 2) - 0.5);
        let mask;
        if (L.kind === "sheet") {
          const t = (wx - 0.5) * L.ca + (wy - 0.5) * L.sa - (L.pos - 0.5) + wob;
          mask = smoothstep(-L.feather, L.feather, t);
        } else {
          const dx = wx - L.cx;
          const dy = wy - L.cy;
          const dxr = dx * L.rc + dy * L.rs;
          const dyr = -dx * L.rs + dy * L.rc;
          const d =
            Math.sqrt(dxr * dxr + (dyr / L.aspect) * (dyr / L.aspect)) + wob;
          mask = smoothstep(L.radius + L.feather, L.radius - L.feather, d);
        }
        const a = mask * L.opacity;
        if (a > 0.001) {
          // internal sheen: blend the shape color toward its lighter tint
          const gt = clamp(0.5 + (nx - 0.5) * L.gx + (ny - 0.5) * L.gy, 0, 1) * L.gmix;
          r = lerp(r, lerp(L.color[0], L.co[0], gt), a);
          g = lerp(g, lerp(L.color[1], L.co[1], gt), a);
          b = lerp(b, lerp(L.color[2], L.co[2], gt), a);
        }
      }

      // specular crease: narrow bright core + a soft light halo beside it
      if (hasSpec) {
        const sw =
          spec.warp * (fbm(wx * spec.es + spec.eox, wy * spec.es + spec.eoy, 2) - 0.5);
        const st = (wx - 0.5) * spec.ca + (wy - 0.5) * spec.sa - (spec.pos - 0.5) + sw;
        const halo = Math.exp(-(st * st) / (2 * (spec.w * 3.6) * (spec.w * 3.6)));
        const core = Math.exp(-(st * st) / (2 * spec.w * spec.w));
        r = lerp(r, light[0], halo * spec.strength * 0.5);
        g = lerp(g, light[1], halo * spec.strength * 0.5);
        b = lerp(b, light[2], halo * spec.strength * 0.5);
        r = lerp(r, 255, core * spec.strength * 0.85);
        g = lerp(g, 255, core * spec.strength * 0.85);
        b = lerp(b, 255, core * spec.strength * 0.85);
      }

      // soft bloom where light pours through
      const bdx = nx - bloomX;
      const bdy = ny - bloomY;
      const bloom = Math.exp(-(bdx * bdx + bdy * bdy) / (2 * bloomR * bloomR));
      r = lerp(r, 255, bloom * 0.38);
      g = lerp(g, 255, bloom * 0.38);
      b = lerp(b, 255, bloom * 0.38);

      // gentle large-scale luminance drift
      const tm = 1 + (fbm(nx * 0.8 + tox, ny * 0.8 + toy, 3) - 0.5) * tAmp;
      r *= tm;
      g *= tm;
      b *= tm;

      const idx = (y * fieldSize + x) * 3;
      rgb[idx] = r;
      rgb[idx + 1] = g;
      rgb[idx + 2] = b;
    }
  }

  return { rgb, fieldSize };
}

/* Bilinear upscale square field -> W×H RGB bytes (center-cropped to the
 * output aspect), with subtle grain to break up banding. */
function upscaleToBytes(field, W, H, rand) {
  const { rgb, fieldSize } = field;
  const out = Buffer.allocUnsafe(W * H * 3);
  const aspect = W / H;
  const cropH = Math.min(1, 1 / aspect); // fraction of field height kept
  const yStart = (1 - cropH) / 2;
  const sx = (fieldSize - 1) / (W - 1);
  for (let y = 0; y < H; y++) {
    const fy = (yStart + (H === 1 ? 0 : (y / (H - 1)) * cropH)) * (fieldSize - 1);
    const y0 = Math.floor(fy);
    const y1 = Math.min(fieldSize - 1, y0 + 1);
    const wy = fy - y0;
    for (let x = 0; x < W; x++) {
      const fx = x * sx;
      const x0 = Math.floor(fx);
      const x1 = Math.min(fieldSize - 1, x0 + 1);
      const wx = fx - x0;
      const i00 = (y0 * fieldSize + x0) * 3;
      const i10 = (y0 * fieldSize + x1) * 3;
      const i01 = (y1 * fieldSize + x0) * 3;
      const i11 = (y1 * fieldSize + x1) * 3;
      const grain = (rand() - 0.5) * 6.5; // dither: survives WebP, kills banding
      const o = (y * W + x) * 3;
      for (let c = 0; c < 3; c++) {
        const top = lerp(rgb[i00 + c], rgb[i10 + c], wx);
        const bot = lerp(rgb[i01 + c], rgb[i11 + c], wx);
        out[o + c] = clamp(lerp(top, bot, wy) + grain, 0, 255);
      }
    }
  }
  return out;
}

/* -------------------------------- encode -------------------------------- */
async function encode(bytes, W, H, format, quality, out) {
  const img = sharp(bytes, { raw: { width: W, height: H, channels: 3 } });
  // a whisper of blur removes residual stepping without softening the edges
  img.blur(0.5);
  const buf =
    format === "png"
      ? await img.png({ compressionLevel: 9 }).toBuffer()
      : await img
          .webp({ quality, effort: 6, smartSubsample: true })
          .toBuffer();
  writeFileSync(out, buf);
  return buf.length;
}

/* --------------------------------- main --------------------------------- */
async function main() {
  const args = parseArgs(process.argv);

  if (args.list) {
    console.log("Palettes:\n  " + Object.keys(PALETTES).join("\n  "));
    return;
  }

  const names = Object.keys(PALETTES);
  const pickPalette = () => {
    if (args.palette && args.palette !== "random") {
      if (!PALETTES[args.palette]) {
        console.error(`Unknown palette "${args.palette}". Try --list.`);
        process.exit(1);
      }
      return args.palette;
    }
    return names[(Math.random() * names.length) | 0];
  };

  // Resolve output format: explicit flag, else infer from --out extension
  const format =
    args.format ||
    (args.out && args.out.toLowerCase().endsWith(".png") ? "png" : "webp");
  const quality = args.quality || 90;

  const count = Math.max(1, args.count || 1);
  mkdirSync(args.outdir, { recursive: true });

  const W = args.size;
  const H = args.square ? W : Math.round((W * 9) / 16);

  for (let i = 0; i < count; i++) {
    const palette = pickPalette();
    const seed =
      args.seed !== undefined ? args.seed : (Math.random() * 1e9) | 0;
    // render at full output resolution — no upscale facets on the edges
    const fieldSize = Math.min(2048, Math.max(400, W));

    const field = renderField(palette, seed, fieldSize);
    const bytes = upscaleToBytes(field, W, H, mulberry32(seed ^ 0x9e3779b9));

    const out =
      count === 1 && args.out
        ? args.out
        : path.join(args.outdir, `cover-${palette}-${seed}.${format}`);
    mkdirSync(path.dirname(out), { recursive: true });
    const size = await encode(bytes, W, H, format, quality, out);

    const webPath = "/" + path.relative("public", out).split(path.sep).join("/");
    const kb = (size / 1024).toFixed(0);
    console.log(`✓ ${out}  (${palette}, seed ${seed}, ${W}×${H}, ${kb} KB)`);
    console.log(`    frontmatter →  cover: "${webPath}"`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
