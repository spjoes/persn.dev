"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface FlipCardProps {
  frontImage: string;
  backImage: string;
  alt: string;
}

export function FlipCard({ frontImage, backImage, alt }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-[300px] w-[300px] cursor-pointer perspective"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full preserve-3d transition-all duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute h-full w-full backface-hidden overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
          {frontImage && (
            <Image
              src={frontImage}
              alt={`${alt} - personal photo`}
              fill
              sizes="300px"
              className="object-cover"
              priority
            />
          )}
        </div>
        
        <div className="absolute h-full w-full rotate-y-180 backface-hidden overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
          {backImage && (
            <Image
              src={backImage}
              alt={`${alt} - profile photo`}
              fill
              sizes="300px"
              className="object-cover"
              priority
            />
          )}
        </div>
      </motion.div>
    </div>
  );
} 