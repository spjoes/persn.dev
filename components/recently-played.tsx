"use client";

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import Image from "next/image";
import { Icon } from "./icons";

interface AppleMusicTrack {
  name: string;
  artist: string;
  album: string;
  artworkUrl: string;
  trackUrl: string;
}

interface AlbumPalette {
  borderColor: string;
  glowColor: string;
  shadowColor: string;
}

interface LabColor {
  l: number;
  a: number;
  b: number;
}

interface SamplePixel {
  r: number;
  g: number;
  b: number;
  saturation: number;
  lab: LabColor;
  weight: number;
  saliency: number;
}

const FALLBACK_PALETTE: AlbumPalette = {
  borderColor: "rgb(113 113 122)",
  glowColor: "rgba(139, 157, 255, 0.30)",
  shadowColor: "rgba(139, 157, 255, 0.40)",
};

const KMEANS_CLUSTER_COUNT = 5;
const KMEANS_MAX_ITERATIONS = 6;
const SAMPLE_SIZE = 28;

/* ---------- color math (album-art accent extraction) ---------- */

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;
  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
  }

  return {
    h: Math.round(hue * 60 < 0 ? hue * 60 + 360 : hue * 60),
    s: saturation,
    l: lightness,
  };
}

function hslToRgb(h: number, s: number, l: number) {
  const hue = h / 360;
  if (s === 0) {
    const value = Math.round(l * 255);
    return { r: value, g: value, b: value };
  }
  const hueToRgb = (p: number, q: number, t: number) => {
    let temp = t;
    if (temp < 0) temp += 1;
    if (temp > 1) temp -= 1;
    if (temp < 1 / 6) return p + (q - p) * 6 * temp;
    if (temp < 1 / 2) return q;
    if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hue) * 255),
    b: Math.round(hueToRgb(p, q, hue - 1 / 3) * 255),
  };
}

function srgbChannelToLinear(value: number) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function rgbToLab(r: number, g: number, b: number): LabColor {
  const red = srgbChannelToLinear(r);
  const green = srgbChannelToLinear(g);
  const blue = srgbChannelToLinear(b);
  const x = (red * 0.4124 + green * 0.3576 + blue * 0.1805) / 0.95047;
  const y = red * 0.2126 + green * 0.7152 + blue * 0.0722;
  const z = (red * 0.0193 + green * 0.1192 + blue * 0.9505) / 1.08883;
  const transform = (value: number) =>
    value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116;
  const fx = transform(x);
  const fy = transform(y);
  const fz = transform(z);
  return { l: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

function getLabDistance(a: LabColor, b: LabColor) {
  const dl = a.l - b.l;
  const da = a.a - b.a;
  const db = a.b - b.b;
  return Math.sqrt(dl * dl + da * da + db * db);
}

function getNeutralDistance(lab: LabColor) {
  return Math.sqrt(lab.a * lab.a + lab.b * lab.b);
}

function getPixelDistanceSquared(a: LabColor, b: LabColor) {
  const dl = a.l - b.l;
  const da = a.a - b.a;
  const db = a.b - b.b;
  return dl * dl + da * da + db * db;
}

function getAverageSampleColor(samples: SamplePixel[]) {
  let r = 0;
  let g = 0;
  let b = 0;
  let total = 0;
  for (const s of samples) {
    r += s.r * s.weight;
    g += s.g * s.weight;
    b += s.b * s.weight;
    total += s.weight;
  }
  return {
    r: Math.round(r / total),
    g: Math.round(g / total),
    b: Math.round(b / total),
  };
}

function getAverageLab(samples: SamplePixel[]) {
  const c = getAverageSampleColor(samples);
  return rgbToLab(c.r, c.g, c.b);
}

function getBackgroundLab(data: Uint8ClampedArray, width: number, height: number) {
  const borderSamples: SamplePixel[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const isBorderPixel = x < 2 || x >= width - 2 || y < 2 || y >= height - 2;
      if (!isBorderPixel) continue;
      const index = (y * width + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      if (alpha < 128) continue;
      const { s, l } = rgbToHsl(red, green, blue);
      if (l < 0.03 || l > 0.97 || s < 0.02) continue;
      borderSamples.push({
        r: red,
        g: green,
        b: blue,
        saturation: s,
        lab: rgbToLab(red, green, blue),
        weight: 1,
        saliency: 0,
      });
    }
  }
  if (borderSamples.length === 0) return null;
  return getAverageLab(borderSamples);
}

function getInitialCentroids(samples: SamplePixel[], clusterCount: number) {
  const firstCentroid = samples.reduce((best, sample) => {
    const bestScore =
      best.weight * 0.45 +
      best.saturation * 0.3 +
      clamp(getNeutralDistance(best.lab) / 90, 0, 1) * 0.25;
    const sampleScore =
      sample.weight * 0.45 +
      sample.saturation * 0.3 +
      clamp(getNeutralDistance(sample.lab) / 90, 0, 1) * 0.25;
    return sampleScore > bestScore ? sample : best;
  }, samples[0]);

  const centroids = [firstCentroid.lab];

  while (centroids.length < clusterCount) {
    let nextCentroid = samples[0].lab;
    let bestScore = -1;
    for (const sample of samples) {
      const nearestDistance = centroids.reduce(
        (min, c) => Math.min(min, getPixelDistanceSquared(sample.lab, c)),
        Number.POSITIVE_INFINITY
      );
      const score =
        nearestDistance *
        (0.3 +
          sample.weight * 0.35 +
          sample.saturation * 0.2 +
          clamp(getNeutralDistance(sample.lab) / 90, 0, 1) * 0.15);
      if (score > bestScore) {
        bestScore = score;
        nextCentroid = sample.lab;
      }
    }
    centroids.push(nextCentroid);
  }
  return centroids;
}

function getDominantClusterColor(
  samples: SamplePixel[],
  backgroundLab: LabColor | null
) {
  const clusterCount = Math.min(KMEANS_CLUSTER_COUNT, samples.length);
  if (clusterCount === 0) return null;

  let centroids = getInitialCentroids(samples, clusterCount);

  for (let iteration = 0; iteration < KMEANS_MAX_ITERATIONS; iteration += 1) {
    const buckets: SamplePixel[][] = Array.from({ length: clusterCount }, () => []);
    for (const sample of samples) {
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (let i = 0; i < centroids.length; i += 1) {
        const d = getPixelDistanceSquared(sample.lab, centroids[i]);
        if (d < nearestDistance) {
          nearestDistance = d;
          nearest = i;
        }
      }
      buckets[nearest].push(sample);
    }
    centroids = centroids.map((centroid, index) =>
      buckets[index].length > 0 ? getAverageLab(buckets[index]) : centroid
    );
  }

  const finalBuckets: SamplePixel[][] = Array.from({ length: clusterCount }, () => []);
  for (const sample of samples) {
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < centroids.length; i += 1) {
      const d = getPixelDistanceSquared(sample.lab, centroids[i]);
      if (d < nearestDistance) {
        nearestDistance = d;
        nearest = i;
      }
    }
    finalBuckets[nearest].push(sample);
  }

  const totalWeight = samples.reduce((sum, s) => sum + s.weight, 0);
  const ranked = finalBuckets
    .filter((bucket) => bucket.length > 0)
    .map((bucket) => {
      const averageColor = getAverageSampleColor(bucket);
      const averageLab = rgbToLab(averageColor.r, averageColor.g, averageColor.b);
      const { s, l } = rgbToHsl(averageColor.r, averageColor.g, averageColor.b);
      const clusterWeight = bucket.reduce((sum, sample) => sum + sample.weight, 0);
      const averageSaliency =
        bucket.reduce((sum, sample) => sum + sample.saliency * sample.weight, 0) /
        clusterWeight;
      const areaScore = clusterWeight / totalWeight;
      const saturationScore = clamp(s, 0, 1);
      const neutralDistanceScore = clamp(getNeutralDistance(averageLab) / 80, 0, 1);
      const saliencyScore = clamp(averageSaliency, 0, 1);
      const backgroundContrastScore = backgroundLab
        ? clamp(getLabDistance(averageLab, backgroundLab) / 55, 0, 1)
        : 0.5;
      const midtoneScore = clamp(1 - Math.abs(l - 0.52) * 1.65, 0, 1);
      const score =
        areaScore * 0.24 +
        saturationScore * 0.22 +
        neutralDistanceScore * 0.2 +
        saliencyScore * 0.2 +
        backgroundContrastScore * 0.09 +
        midtoneScore * 0.05;
      return { color: averageColor, score };
    })
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.color ?? null;
}

function getPixelLuminance(r: number, g: number, b: number) {
  return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
}

function buildWeightedSamples(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  backgroundLab: LabColor | null
) {
  const samples: SamplePixel[] = [];
  const centerX = (width - 1) / 2;
  const centerY = (height - 1) / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY) || 1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      if (alpha < 128) continue;

      const { s } = rgbToHsl(red, green, blue);
      const luminance = getPixelLuminance(red, green, blue);
      if (luminance < 0.08 || luminance > 0.95) continue;
      if (s < 0.08) continue;

      const lab = rgbToLab(red, green, blue);
      const backgroundDistance = backgroundLab
        ? clamp(getLabDistance(lab, backgroundLab) / 55, 0, 1)
        : 0.5;
      const distanceFromCenter = Math.sqrt(
        (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY)
      );
      const centerBias = 1 - distanceFromCenter / maxDistance;

      const localContrastValues: number[] = [];
      const neighbors = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ];
      for (const [dx, dy] of neighbors) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const ni = (ny * width + nx) * 4;
        const neighborLab = rgbToLab(data[ni], data[ni + 1], data[ni + 2]);
        localContrastValues.push(clamp(getLabDistance(lab, neighborLab) / 40, 0, 1));
      }
      const localContrast =
        localContrastValues.length > 0
          ? localContrastValues.reduce((sum, v) => sum + v, 0) /
            localContrastValues.length
          : 0;
      const saliency = clamp(backgroundDistance * 0.6 + localContrast * 0.4, 0, 1);
      const weight = 0.3 + centerBias * 0.3 + saliency * 0.28 + clamp(s, 0, 1) * 0.12;

      samples.push({ r: red, g: green, b: blue, saturation: s, lab, weight, saliency });
    }
  }
  return samples;
}

async function extractAlbumPalette(imageUrl: string): Promise<AlbumPalette | null> {
  if (typeof window === "undefined") return null;

  return new Promise((resolve) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return resolve(null);

        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const backgroundLab = getBackgroundLab(data, SAMPLE_SIZE, SAMPLE_SIZE);
        const samples = buildWeightedSamples(data, SAMPLE_SIZE, SAMPLE_SIZE, backgroundLab);
        if (samples.length === 0) return resolve(null);

        const dominant = getDominantClusterColor(samples, backgroundLab);
        if (!dominant) return resolve(null);

        const accentHsl = rgbToHsl(dominant.r, dominant.g, dominant.b);
        const accentRgb = hslToRgb(
          accentHsl.h,
          clamp(Math.max(accentHsl.s, 0.45), 0.45, 0.88),
          clamp(accentHsl.l, 0.4, 0.62)
        );
        resolve({
          borderColor: `rgb(${accentRgb.r} ${accentRgb.g} ${accentRgb.b})`,
          glowColor: `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.38)`,
          shadowColor: `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.5)`,
        });
      } catch {
        resolve(null);
      }
    };
    image.onerror = () => resolve(null);
    image.src = imageUrl;
  });
}

/* --------------------------- component --------------------------- */

export function RecentlyPlayed() {
  const [tracks, setTracks] = useState<AppleMusicTrack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [palettes, setPalettes] = useState<Record<string, AlbumPalette>>({});

  const fetchRecentTracks = useCallback(async () => {
    try {
      const response = await fetch("/api/apple-music");
      const data = await response.json();
      if (!response.ok) {
        const message =
          typeof data?.error === "string"
            ? data.error
            : "Couldn't reach Apple Music";
        throw new Error(message);
      }
      setTracks(data as AppleMusicTrack[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load music");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentTracks();
    const interval = setInterval(fetchRecentTracks, 20000);
    return () => clearInterval(interval);
  }, [fetchRecentTracks]);

  // Extract accent palettes for new artwork
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const pending = tracks.filter((t) => t.artworkUrl && !palettes[t.trackUrl]);
      if (pending.length === 0) return;
      const results = await Promise.all(
        pending.map(async (t) => ({
          trackUrl: t.trackUrl,
          palette: await extractAlbumPalette(t.artworkUrl),
        }))
      );
      if (cancelled) return;
      setPalettes((prev) => {
        const next = { ...prev };
        for (const { trackUrl, palette } of results) {
          next[trackUrl] = palette ?? FALLBACK_PALETTE;
        }
        return next;
      });
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [tracks, palettes]);

  const Header = (
    <div className="mb-8 flex items-center gap-4">
      <span className="eyebrow">Recently played</span>
      <span className="h-px flex-1 bg-[var(--line)]" />
      <span className="inline-flex items-center gap-1.5 text-[var(--ink-faint)]">
        <Icon.appleMusic className="h-3.5 w-3.5" />
        <span className="font-mono text-[11px] tracking-wide">Apple Music</span>
      </span>
    </div>
  );

  if (error) {
    return (
      <div className="w-full">
        {Header}
        <div className="flex items-center gap-2 text-sm text-[var(--ink-faint)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink-faint)]" />
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full">
        {Header}
        <div className="flex gap-4 overflow-hidden sm:grid sm:grid-cols-5 sm:gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shrink-0 basis-[42%] sm:basis-auto">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)]">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.8s infinite",
                  }}
                />
              </div>
              <div className="mt-3 h-3.5 w-3/4 rounded bg-[var(--bg-soft)]" />
              <div className="mt-2 h-3 w-1/2 rounded bg-[var(--bg-soft)]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tracks.length === 0) return null;

  return (
    <div className="w-full">
      {Header}

      <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
        {tracks.map((track, index) => {
          const palette = palettes[track.trackUrl] ?? FALLBACK_PALETTE;
          const albumVars = {
            "--album-border": palette.borderColor,
            "--album-glow": palette.glowColor,
            "--album-shadow": palette.shadowColor,
          } as CSSProperties;
          return (
            <a
              key={track.trackUrl}
              href={track.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={albumVars}
              className="group relative block shrink-0 basis-[42%] snap-start outline-none sm:basis-auto"
              aria-label={`${track.name} by ${track.artist}`}
            >
              <div className="relative aspect-square">
                <div
                  className="pointer-events-none absolute -inset-2 rounded-[28px] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at center, var(--album-glow), transparent 70%)",
                  }}
                />
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[var(--line)] shadow-[0_2px_14px_-6px_rgba(0,0,0,0.7)] transition-all duration-300 will-change-transform group-hover:-translate-y-1.5 group-hover:[border-color:var(--album-border)] group-hover:shadow-[0_16px_38px_-12px_var(--album-shadow),0_0_0_1px_var(--album-border)] group-focus-visible:[border-color:var(--album-border)]">
                  {track.artworkUrl ? (
                    <Image
                      src={track.artworkUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 45vw, 220px"
                      className="object-cover"
                      quality={92}
                      unoptimized
                      priority={index < 2}
                    />
                  ) : (
                    <div className="h-full w-full bg-[var(--bg-soft)]" />
                  )}
                </div>
              </div>

              <div className="mt-3">
                <p className="truncate text-sm font-medium text-[var(--ink)] transition-colors group-hover:text-white">
                  {track.name}
                </p>
                <p className="truncate text-[13px] text-[var(--ink-faint)]">
                  {track.artist}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
