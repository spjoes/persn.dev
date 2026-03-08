"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
  borderColor: "rgb(82 82 91)",
  glowColor: "rgba(113, 113, 122, 0.35)",
  shadowColor: "rgba(113, 113, 122, 0.45)",
};

const KMEANS_CLUSTER_COUNT = 5;
const KMEANS_MAX_ITERATIONS = 6;
const SAMPLE_SIZE = 28;

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
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
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

  const transform = (value: number) => {
    return value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116;
  };

  const fx = transform(x);
  const fy = transform(y);
  const fz = transform(z);

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

function getLabDistance(a: LabColor, b: LabColor) {
  const lightnessDelta = a.l - b.l;
  const aDelta = a.a - b.a;
  const bDelta = a.b - b.b;
  return Math.sqrt(
    lightnessDelta * lightnessDelta + aDelta * aDelta + bDelta * bDelta
  );
}

function getNeutralDistance(lab: LabColor) {
  return Math.sqrt(lab.a * lab.a + lab.b * lab.b);
}

function getPixelDistanceSquared(a: LabColor, b: LabColor) {
  const lightnessDelta = a.l - b.l;
  const aDelta = a.a - b.a;
  const bDelta = a.b - b.b;
  return (
    lightnessDelta * lightnessDelta +
    aDelta * aDelta +
    bDelta * bDelta
  );
}

function getAverageSampleColor(samples: SamplePixel[]) {
  let redTotal = 0;
  let greenTotal = 0;
  let blueTotal = 0;
  let totalWeight = 0;

  for (const sample of samples) {
    redTotal += sample.r * sample.weight;
    greenTotal += sample.g * sample.weight;
    blueTotal += sample.b * sample.weight;
    totalWeight += sample.weight;
  }

  return {
    r: Math.round(redTotal / totalWeight),
    g: Math.round(greenTotal / totalWeight),
    b: Math.round(blueTotal / totalWeight),
  };
}

function getAverageLab(samples: SamplePixel[]) {
  const averageColor = getAverageSampleColor(samples);
  return rgbToLab(averageColor.r, averageColor.g, averageColor.b);
}

function getBackgroundLab(
  data: Uint8ClampedArray,
  width: number,
  height: number
) {
  const borderSamples: SamplePixel[] = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const isBorderPixel =
        x < 2 || x >= width - 2 || y < 2 || y >= height - 2;

      if (!isBorderPixel) {
        continue;
      }

      const index = (y * width + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];

      if (alpha < 128) {
        continue;
      }

      const { s, l } = rgbToHsl(red, green, blue);
      if (l < 0.03 || l > 0.97 || s < 0.02) {
        continue;
      }

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

  if (borderSamples.length === 0) {
    return null;
  }

  return getAverageLab(borderSamples);
}

function getInitialCentroids(samples: SamplePixel[], clusterCount: number) {
  const firstCentroid = samples.reduce((bestSample, sample) => {
    const bestScore =
      bestSample.weight * 0.45 +
      bestSample.saturation * 0.3 +
      clamp(getNeutralDistance(bestSample.lab) / 90, 0, 1) * 0.25;
    const sampleScore =
      sample.weight * 0.45 +
      sample.saturation * 0.3 +
      clamp(getNeutralDistance(sample.lab) / 90, 0, 1) * 0.25;

    return sampleScore > bestScore ? sample : bestSample;
  }, samples[0]);

  const centroids = [firstCentroid.lab];

  while (centroids.length < clusterCount) {
    let nextCentroid = samples[0].lab;
    let bestScore = -1;

    for (const sample of samples) {
      const nearestDistance = centroids.reduce((minimumDistance, centroid) => {
        return Math.min(
          minimumDistance,
          getPixelDistanceSquared(sample.lab, centroid)
        );
      }, Number.POSITIVE_INFINITY);
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

  if (clusterCount === 0) {
    return null;
  }

  let centroids = getInitialCentroids(samples, clusterCount);

  for (let iteration = 0; iteration < KMEANS_MAX_ITERATIONS; iteration += 1) {
    const buckets: SamplePixel[][] = Array.from(
      { length: clusterCount },
      () => []
    );

    for (const sample of samples) {
      let nearestClusterIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < centroids.length; i += 1) {
        const distance = getPixelDistanceSquared(sample.lab, centroids[i]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestClusterIndex = i;
        }
      }

      buckets[nearestClusterIndex].push(sample);
    }

    centroids = centroids.map((centroid, index) => {
      const bucket = buckets[index];
      return bucket.length > 0 ? getAverageLab(bucket) : centroid;
    });
  }

  const finalBuckets: SamplePixel[][] = Array.from(
    { length: clusterCount },
    () => []
  );

  for (const sample of samples) {
    let nearestClusterIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < centroids.length; i += 1) {
      const distance = getPixelDistanceSquared(sample.lab, centroids[i]);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestClusterIndex = i;
      }
    }

    finalBuckets[nearestClusterIndex].push(sample);
  }

  const totalWeight = samples.reduce((sum, sample) => sum + sample.weight, 0);
  const rankedClusters = finalBuckets
    .filter((bucket) => bucket.length > 0)
    .map((bucket, index) => {
      const averageColor = getAverageSampleColor(bucket);
      const averageLab = rgbToLab(
        averageColor.r,
        averageColor.g,
        averageColor.b
      );
      const { s, l } = rgbToHsl(
        averageColor.r,
        averageColor.g,
        averageColor.b
      );
      const clusterWeight = bucket.reduce((sum, sample) => sum + sample.weight, 0);
      const averageSaliency =
        bucket.reduce((sum, sample) => sum + sample.saliency * sample.weight, 0) /
        clusterWeight;
      const areaScore = clusterWeight / totalWeight;
      const saturationScore = clamp(s, 0, 1);
      const neutralDistanceScore = clamp(
        getNeutralDistance(averageLab) / 80,
        0,
        1
      );
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

      return {
        color: averageColor,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return rankedClusters[0]?.color ?? null;
}

function getPixelLuminance(red: number, green: number, blue: number) {
  return (red * 0.299 + green * 0.587 + blue * 0.114) / 255;
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

      if (alpha < 128) {
        continue;
      }

      const { s } = rgbToHsl(red, green, blue);
      const luminance = getPixelLuminance(red, green, blue);

      if (luminance < 0.08 || luminance > 0.95) {
        continue;
      }

      if (s < 0.08) {
        continue;
      }

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
        const neighborX = x + dx;
        const neighborY = y + dy;

        if (
          neighborX < 0 ||
          neighborX >= width ||
          neighborY < 0 ||
          neighborY >= height
        ) {
          continue;
        }

        const neighborIndex = (neighborY * width + neighborX) * 4;
        const neighborLab = rgbToLab(
          data[neighborIndex],
          data[neighborIndex + 1],
          data[neighborIndex + 2]
        );
        localContrastValues.push(
          clamp(getLabDistance(lab, neighborLab) / 40, 0, 1)
        );
      }

      const localContrast =
        localContrastValues.length > 0
          ? localContrastValues.reduce((sum, value) => sum + value, 0) /
            localContrastValues.length
          : 0;
      const saliency = clamp(
        backgroundDistance * 0.6 + localContrast * 0.4,
        0,
        1
      );
      const weight =
        0.3 +
        centerBias * 0.3 +
        saliency * 0.28 +
        clamp(s, 0, 1) * 0.12;

      samples.push({
        r: red,
        g: green,
        b: blue,
        saturation: s,
        lab,
        weight,
        saliency,
      });
    }
  }

  return samples;
}

async function extractAlbumPalette(imageUrl: string): Promise<AlbumPalette | null> {
  if (typeof window === "undefined") {
    return null;
  }

  return new Promise((resolve) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });

        if (!context) {
          resolve(null);
          return;
        }

        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const backgroundLab = getBackgroundLab(data, SAMPLE_SIZE, SAMPLE_SIZE);
        const samples = buildWeightedSamples(
          data,
          SAMPLE_SIZE,
          SAMPLE_SIZE,
          backgroundLab
        );

        if (samples.length === 0) {
          resolve(null);
          return;
        }

        const dominantClusterColor = getDominantClusterColor(
          samples,
          backgroundLab
        );

        if (!dominantClusterColor) {
          resolve(null);
          return;
        }

        const accentHsl = rgbToHsl(
          dominantClusterColor.r,
          dominantClusterColor.g,
          dominantClusterColor.b
        );
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

export function RecentlyPlayed() {
  const [tracks, setTracks] = useState<AppleMusicTrack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [touchedTrack, setTouchedTrack] = useState<string | null>(null);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [albumPalettes, setAlbumPalettes] = useState<Record<string, AlbumPalette>>({});

  const fetchRecentTracks = async () => {
    try {
      const response = await fetch('/api/apple-music');

      if (!response.ok) {
        throw new Error("Failed to fetch Apple Music data");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTracks(data as AppleMusicTrack[]);
      setError(null);
      setIsInitialLoad(false);
    } catch (err) {
      console.error("Error fetching Apple Music data:", err);
      setError("Failed to load music data");
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchRecentTracks();
    const interval = setInterval(fetchRecentTracks, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPalettes = async () => {
      const pendingTracks = tracks.filter(
        (track) => track.artworkUrl && !albumPalettes[track.trackUrl]
      );

      if (pendingTracks.length === 0) {
        return;
      }

      const palettes = await Promise.all(
        pendingTracks.map(async (track) => ({
          trackUrl: track.trackUrl,
          palette: await extractAlbumPalette(track.artworkUrl),
        }))
      );

      if (cancelled) {
        return;
      }

      setAlbumPalettes((prev) => {
        const next = { ...prev };
        for (const { trackUrl, palette } of palettes) {
          next[trackUrl] = palette ?? FALLBACK_PALETTE;
        }
        return next;
      });
    };

    void loadPalettes();

    return () => {
      cancelled = true;
    };
  }, [tracks, albumPalettes]);

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const trackElement = element?.closest('[data-track-url]');

    if (trackElement) {
      const url = trackElement.getAttribute('data-track-url');
      if (url && url !== touchedTrack) {
        setTouchedTrack(url);
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchedTrack(null);
  };

  if (error) {
    return (
      <div className="text-center text-sm text-zinc-500">
        {error}
      </div>
    );
  }

  if (isInitialLoad) {
    return (
      <div className="w-full">
        <div className="relative">
          <div className="flex items-end justify-center gap-0 px-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="relative"
                style={{
                  marginLeft: index === 0 ? '0' : '-80px',
                  zIndex: 5 - index,
                }}
              >
                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                  <div
                    className="absolute inset-0 rounded-lg bg-black opacity-40 blur-xl"
                    style={{
                      transform: `translateY(${8 + index * 2}px)`,
                      zIndex: -1,
                    }}
                  />
                  <div
                    className="relative w-full h-full rounded-lg overflow-hidden border-2 border-zinc-800 shadow-2xl bg-zinc-800"
                    style={{
                      boxShadow: `0 ${20 - index * 2}px ${40 - index * 4}px -12px rgba(0, 0, 0, 0.6), 0 8px 16px -8px rgba(0, 0, 0, 0.8)`,
                      animation: `bounce-up 0.6s ease-in-out ${index * 0.15}s infinite`
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent animate-shimmer"
                      style={{
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s infinite'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
              <AppleMusicIcon />
              <span className="text-xs font-medium text-zinc-400">
                Recently Played
              </span>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer { animation: shimmer 2s infinite; }
          @keyframes bounce-up {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full">
      {tracks.length > 0 && (
        <div className="relative">
          <div
            className="flex items-end justify-center gap-0 px-4"
            style={{ touchAction: 'none' }}
          >
            <AnimatePresence mode="popLayout">
              {tracks.map((track, index) => {
                const isTouched = touchedTrack === track.trackUrl;
                const isHovered = hoveredTrack === track.trackUrl;
                const isActive = isTouched || isHovered;
                const palette = albumPalettes[track.trackUrl] ?? FALLBACK_PALETTE;
                return (
                  <motion.a
                    key={track.trackUrl}
                    href={track.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track-url={track.trackUrl}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{
                      opacity: 1,
                      scale: isActive ? 1.05 : 1,
                      y: isActive ? -20 : 0,
                      zIndex: tracks.length - index,
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      layout: { duration: 0.4, ease: "easeInOut" },
                      scale: { duration: 0.2 },
                      y: { duration: 0.2 }
                    }}
                    onHoverStart={() => setHoveredTrack(track.trackUrl)}
                    onHoverEnd={() => setHoveredTrack((current) => (
                      current === track.trackUrl ? null : current
                    ))}
                    onTouchStart={() => setTouchedTrack(track.trackUrl)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="relative group"
                    style={{ marginLeft: index === 0 ? '0' : '-80px' }}
                  >
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                      <div
                        className="absolute inset-0 rounded-lg bg-black opacity-60 blur-xl"
                        style={{
                          transform: `translateY(${8 + index * 2}px)`,
                          zIndex: -1,
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-lg transition-all duration-200 blur-md"
                        style={{
                          transform: 'translateY(4px)',
                          zIndex: -1,
                          opacity: isActive ? 1 : 0,
                          background: `radial-gradient(circle at center, ${palette.glowColor} 0%, transparent 72%)`,
                          boxShadow: isActive ? `0 0 32px 4px ${palette.shadowColor}` : 'none',
                        }}
                      />

                      <div
                        className="relative w-full h-full rounded-lg overflow-hidden border-2 shadow-2xl transition-all duration-200"
                        style={{
                          borderColor: isActive ? palette.borderColor : 'rgb(39 39 42)',
                          boxShadow: isActive
                            ? `0 ${20 - index * 2}px ${40 - index * 4}px -12px rgba(0, 0, 0, 0.6), 0 8px 16px -8px rgba(0, 0, 0, 0.8), 0 0 0 1px ${palette.borderColor}, 0 0 24px ${palette.shadowColor}`
                            : `0 ${20 - index * 2}px ${40 - index * 4}px -12px rgba(0, 0, 0, 0.6), 0 8px 16px -8px rgba(0, 0, 0, 0.8)`
                        }}
                      >
                        {loadingImages.has(track.trackUrl) && (
                          <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
                        )}

                        {track.artworkUrl && (
                          <Image
                            src={track.artworkUrl}
                            alt={`${track.name} by ${track.artist}`}
                            fill
                            sizes="(max-width: 640px) 128px, 160px"
                            className={`object-cover transition-opacity duration-300 ${
                              loadingImages.has(track.trackUrl) ? 'opacity-0' : 'opacity-100'
                            }`}
                            onLoad={() => {
                              setLoadingImages(prev => {
                                const next = new Set(prev);
                                next.delete(track.trackUrl);
                                return next;
                              });
                            }}
                            priority={index < 2}
                            quality={95}
                            unoptimized
                          />
                        )}
                      </div>

                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[101]">
                        <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-sm font-semibold text-zinc-200 max-w-[200px] truncate">
                            {track.name}
                          </p>
                          <p className="text-xs text-zinc-400 max-w-[200px] truncate">
                            {track.artist}
                          </p>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-zinc-900 border-r border-b border-zinc-700 rotate-45" />
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-3">
            <div className="relative group/badge inline-block">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm cursor-help">
                <AppleMusicIcon />
                <span className="text-xs font-medium text-zinc-400">
                  Recently Played
                </span>
              </div>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 pointer-events-none z-[102]">
                <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                  <p className="text-xs text-zinc-300">
                    Synced from{' '}
                    <span className="font-semibold" style={{ color: '#fc3c44' }}>Apple Music</span>
                  </p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-zinc-900 border-l border-t border-zinc-700 rotate-45" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AppleMusicIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="am-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fc3c44" />
          <stop offset="100%" stopColor="#ff2d55" />
        </linearGradient>
      </defs>
      <path
        d="M9 18V5l12-2v13"
        stroke="url(#am-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3" fill="url(#am-gradient)" />
      <circle cx="18" cy="16" r="3" fill="url(#am-gradient)" />
    </svg>
  );
}
