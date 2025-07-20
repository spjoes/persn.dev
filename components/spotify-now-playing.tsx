"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SpotifyData {
  song: string;
  artist: string;
  albumArt: string;
  trackId: string;
}

export function SpotifyNowPlaying() {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const DISCORD_ID = "202109343678726144";

  const connectWebSocket = useCallback(() => {
    const socket = socketRef.current;
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket already open or connecting.");
      return;
    }

    console.log("Attempting to connect to Lanyard WebSocket...");
    const ws = new WebSocket("wss://api.lanyard.rest/socket");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to Lanyard WebSocket");
      ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
    };

    ws.onclose = () => {
      console.log("Disconnected from Lanyard WebSocket");
      socketRef.current = null;
      setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (error instanceof ErrorEvent) {
        console.error("WebSocket ErrorEvent Message:", error.message);
      }
      console.error("Full WebSocket error object:", JSON.stringify(error));
    };

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data);

      switch (json.op) {
        case 1:
          const heartbeatInterval = json.d.heartbeat_interval;
          setInterval(() => {
            if (ws.readyState === ws.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, heartbeatInterval);
          break;

        case 0:
          switch (json.t) {
            case "INIT_STATE":
            case "PRESENCE_UPDATE":
              if (json.d.spotify) {
                setSpotifyData({
                  song: json.d.spotify.song,
                  artist: json.d.spotify.artist,
                  albumArt: json.d.spotify.album_art_url,
                  trackId: json.d.spotify.track_id,
                });
              } else {
                setSpotifyData(null);
              }
              break;
          }
          break;
      }
    };
  }, []);

  useEffect(() => {
    connectWebSocket();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Page became visible, checking WebSocket status.");
        const socket = socketRef.current;
        if (!socket || socket.readyState === WebSocket.CLOSED) {
          console.log("WebSocket is closed or null, attempting to reconnect.");
          connectWebSocket();
        } else {
          console.log("WebSocket is already open or connecting. State:", socket.readyState);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      const socket = socketRef.current;
      if (socket) {
        console.log("Closing WebSocket connection.");
        socket.close();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connectWebSocket]);

  if (!spotifyData) {
    return null;
  }

  return (
    <a
      href={`https://open.spotify.com/track/${spotifyData.trackId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm transition-colors duration-300 hover:shadow-md hover:border-zinc-700"
      >
        <div className="relative h-14 w-14 overflow-hidden rounded-md shadow-inner">
          <Image
            src={spotifyData.albumArt}
            alt={`${spotifyData.song} album art`}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-medium text-zinc-400">
              Currently listening to
            </h3>
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
          </div>
          <p className="text-lg font-bold text-zinc-300">
            {spotifyData.song}
          </p>
          <p className="text-sm text-zinc-400">
            {spotifyData.artist}
          </p>
        </div>
      </motion.div>
    </a>
  );
} 