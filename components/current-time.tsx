"use client";

import { useState, useEffect } from "react";

export function CurrentTime() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [timeZone, setTimeZone] = useState<string>("");
  const [isoTime, setIsoTime] = useState<string>("");
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: 'America/Los_Angeles'
      };
      
      setCurrentTime(new Intl.DateTimeFormat('en-US', options).format(now));
      setIsoTime(now.toISOString());
      
      const isEDT = now.toLocaleTimeString('en-US', { timeZoneName: 'short', timeZone: 'America/Los_Angeles' }).includes('PDT');
      setTimeZone(isEDT ? 'PDT' : 'PST');
    };
    
    updateTime();
    
    const intervalId = setInterval(updateTime, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="group relative flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm transition-colors hover:bg-zinc-800/50 sm:px-2.5 sm:py-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-zinc-400"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
      <time dateTime={isoTime} className="whitespace-nowrap">{currentTime}</time>
      
      <div
        id="current-time-tooltip"
        role="tooltip"
        className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-zinc-700 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
      >
        California ({timeZone})
      </div>
    </div>
  );
} 