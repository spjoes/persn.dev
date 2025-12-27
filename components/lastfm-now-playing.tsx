"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LastFmTrack {
  name: string;
  artist: {
    "#text": string;
  };
  album: {
    "#text": string;
  };
  image: Array<{
    size: string;
    "#text": string;
  }>;
  url: string;
  date?: {
    uts: string;
  };
  "@attr"?: {
    nowplaying: string;
  };
}

interface TrackData {
  name: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  isPlaying: boolean;
  timestamp?: number;
}

export function LastFmNowPlaying() {
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);
  const [recentTracks, setRecentTracks] = useState<TrackData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [touchedTrack, setTouchedTrack] = useState<string | null>(null);

  const fetchRecentTracks = async () => {
    try {
      const response = await fetch('/api/lastfm');

      if (!response.ok) {
        throw new Error("Failed to fetch Last.fm data");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      const tracks = data.recenttracks?.track || [];

      if (tracks.length === 0) {
        setCurrentTrack(null);
        setRecentTracks([]);
        return;
      }

      const processedTracks: TrackData[] = tracks.map((track: LastFmTrack) => {

        //I think some last.fm tracks have extralarge so we'll prefer that but fall back to large if not available
        const imageUrl = 
          track.image.find((img) => img.size === "extralarge")?.["#text"] ||
          track.image.find((img) => img.size === "large")?.["#text"] ||
          "";
        
        return {
          name: track.name,
          artist: track.artist["#text"],
          album: track.album["#text"],
          image: imageUrl,
          url: track.url,
          isPlaying: track["@attr"]?.nowplaying === "true",
          timestamp: track.date ? parseInt(track.date.uts) : undefined,
        };
      });

      if (processedTracks[0].isPlaying) {
        setCurrentTrack(processedTracks[0]);
        setRecentTracks(processedTracks.slice(1, 6));
      } else {
        setCurrentTrack(null);
        setRecentTracks(processedTracks.slice(0, 5));
      }

      setError(null);
      setIsInitialLoad(false);
    } catch (err) {
      console.error("Error fetching Last.fm data:", err);
      setError("Failed to load music data");
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchRecentTracks();

    // Then poll every 15 seconds. Ill experiment with this later to see if theres a better way to do this.
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

  const allTracks = currentTrack ? [currentTrack, ...recentTracks] : recentTracks;

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
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent animate-shimmer" 
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
            <div className="relative group/badge inline-block">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm cursor-help">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-zinc-400"
                >
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
                <span className="text-xs font-medium text-zinc-400">
                  Recently Played
                </span>
              </div>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 pointer-events-none z-[102]">
                <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                  <p className="text-xs text-zinc-300">
                    Synced from Spotify via{' '}
                    <span className="text-red-400 font-semibold">Last.fm</span>
                  </p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-zinc-900 border-l border-t border-zinc-700 rotate-45" />
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          @keyframes bounce-up {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full">
      {allTracks.length > 0 && (
        <div className="relative">
          <div className="flex items-end justify-center gap-0 px-4" style={{ touchAction: 'none' }}>
            <AnimatePresence mode="popLayout">
              {allTracks.map((track, index) => {
                const isNowPlaying = index === 0 && currentTrack !== null;
                const isTouched = touchedTrack === track.url;
                return (
                  <motion.a
                    key={track.url}
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track-url={track.url}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: isTouched ? 1.05 : 1, 
                      y: isTouched ? -20 : 0,
                      zIndex: allTracks.length - index,
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
                    onTouchStart={() => setTouchedTrack(track.url)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="relative group"
                    style={{
                      marginLeft: index === 0 ? '0' : '-80px',
                    }}
                  >
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                      <div 
                        className="absolute inset-0 rounded-lg bg-black opacity-60 blur-xl"
                        style={{
                          transform: `translateY(${8 + index * 2}px)`,
                          zIndex: -1,
                        }}
                      />
                      
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-md" 
                        style={{ transform: 'translateY(4px)', zIndex: -1 }}
                      />
                      
                      <div className={`relative w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        isNowPlaying 
                          ? 'border-green-500 group-hover:border-green-400 shadow-[0_8px_30px_rgb(34,197,94,0.3)]' 
                          : 'border-zinc-800 group-hover:border-zinc-600 shadow-2xl'
                      }`}
                      style={{
                        boxShadow: isNowPlaying 
                          ? '0 20px 40px -12px rgba(34, 197, 94, 0.4), 0 8px 16px -8px rgba(0, 0, 0, 0.6)'
                          : `0 ${20 - index * 2}px ${40 - index * 4}px -12px rgba(0, 0, 0, 0.6), 0 8px 16px -8px rgba(0, 0, 0, 0.8)`
                      }}>
                        {loadingImages.has(track.url) && (
                          <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
                        )}
                        
                        {track.image && (
                          <Image
                            src={track.image}
                            alt={`${track.name} by ${track.artist}`}
                            fill
                            sizes="(max-width: 640px) 128px, 160px"
                            className={`object-cover transition-opacity duration-300 ${
                              loadingImages.has(track.url) ? 'opacity-0' : 'opacity-100'
                            }`}
                            onLoad={() => {
                              setLoadingImages(prev => {
                                const next = new Set(prev);
                                next.delete(track.url);
                                return next;
                              });
                            }}
                            priority={index < 2}
                            quality={95}
                            unoptimized
                          />
                        )}
                      </div>

                      {isNowPlaying && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                          </span>
                          LIVE
                        </div>
                      )}

                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[101]">
                        <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 shadow-lg">
                          {isNowPlaying && (
                            <p className="text-xs text-green-400 font-semibold mb-1">
                              ● Now Playing
                            </p>
                          )}
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
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-zinc-400"
                >
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
                <span className="text-xs font-medium text-zinc-400">
                  Recently Played
                </span>
              </div>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 pointer-events-none z-[102]">
                <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                  <p className="text-xs text-zinc-300">
                    Synced from Spotify via{' '}
                    <span className="text-red-400 font-semibold">Last.fm</span>
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
