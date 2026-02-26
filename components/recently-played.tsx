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

export function RecentlyPlayed() {
  const [tracks, setTracks] = useState<AppleMusicTrack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [touchedTrack, setTouchedTrack] = useState<string | null>(null);

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
                      scale: isTouched ? 1.05 : 1,
                      y: isTouched ? -20 : 0,
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
                    whileHover={{
                      y: -20,
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
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
                        className="absolute inset-0 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-md"
                        style={{ transform: 'translateY(4px)', zIndex: -1 }}
                      />

                      <div
                        className="relative w-full h-full rounded-lg overflow-hidden border-2 border-zinc-800 group-hover:border-zinc-600 shadow-2xl transition-all duration-200"
                        style={{
                          boxShadow: `0 ${20 - index * 2}px ${40 - index * 4}px -12px rgba(0, 0, 0, 0.6), 0 8px 16px -8px rgba(0, 0, 0, 0.8)`
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
