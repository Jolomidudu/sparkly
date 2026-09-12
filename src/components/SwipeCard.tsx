"use client";

import { useState, useRef } from "react";
import { MapPin, X, Heart } from "lucide-react";
import { Profile } from "@/lib/types";
import clsx from "clsx";

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

export default function SwipeCard({ profile, onSwipe, isTop }: SwipeCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    if (!isTop) return;
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isTop) return;
    const x = clientX - startPos.current.x;
    const y = clientY - startPos.current.y;
    setOffset({ x, y });
  };

  const handleEnd = () => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);

    if (offset.x > 120) {
      onSwipe("right");
    } else if (offset.x < -120) {
      onSwipe("left");
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const rotation = offset.x * 0.08;
  const opacity = Math.max(0, 1 - Math.abs(offset.x) / 300);

  return (
    <div
      ref={cardRef}
      className={clsx(
        "absolute inset-0 rounded-3xl overflow-hidden shadow-2xl swipe-card",
        isTop ? "z-20 cursor-grab active:cursor-grabbing" : "z-10 scale-[0.96] opacity-80"
      )}
      style={{
        transform: isTop
          ? `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`
          : undefined,
        transition: isDragging ? "none" : "transform 0.3s ease, opacity 0.3s ease",
        opacity: isTop ? opacity : undefined,
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      {/* Photo */}
      <div className="relative w-full h-full bg-[#1a1a1f]">
        <img
          src={profile.photos[photoIndex]}
          alt={profile.name}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Photo indicators */}
        {profile.photos.length > 1 && (
          <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-10">
            {profile.photos.map((_, i) => (
              <div
                key={i}
                className={clsx(
                  "h-1 flex-1 rounded-full transition-colors",
                  i === photoIndex ? "bg-white" : "bg-white/30"
                )}
              />
            ))}
          </div>
        )}

        {/* Tap zones for photo change */}
        <div className="absolute inset-0 flex z-10">
          <button
            className="w-1/3 h-full"
            onClick={(e) => {
              e.stopPropagation();
              setPhotoIndex((p) => Math.max(0, p - 1));
            }}
          />
          <button
            className="w-2/3 h-full"
            onClick={(e) => {
              e.stopPropagation();
              setPhotoIndex((p) => Math.min(profile.photos.length - 1, p + 1));
            }}
          />
        </div>

        {/* LIKE / NOPE stamps */}
        {isTop && offset.x > 40 && (
          <div className="absolute top-12 left-6 z-20 border-4 border-green-400 text-green-400 font-black text-3xl px-3 py-1 rounded-lg rotate-[-20deg] opacity-90">
            LIKE
          </div>
        )}
        {isTop && offset.x < -40 && (
          <div className="absolute top-12 right-6 z-20 border-4 border-red-400 text-red-400 font-black text-3xl px-3 py-1 rounded-lg rotate-[20deg] opacity-90">
            NOPE
          </div>
        )}

        {/* Gradient + info */}
        <div className="absolute bottom-0 left-0 right-0 card-gradient pt-24 pb-6 px-5 z-10">
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold text-white drop-shadow">
              {profile.name}
            </h2>
            <span className="text-2xl text-white/90 mb-0.5">{profile.age}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-white/80 text-sm">
            <MapPin className="w-4 h-4" />
            <span>
              {profile.location} · {profile.distance} km away
            </span>
          </div>
          <p className="mt-3 text-white/85 text-[15px] leading-snug line-clamp-2">
            {profile.bio}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.interests.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActionButtons({
  onNope,
  onLike,
}: {
  onNope: () => void;
  onLike: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      <button
        onClick={onNope}
        className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all btn-press shadow-lg"
        aria-label="Pass"
      >
        <X className="w-8 h-8" strokeWidth={2.5} />
      </button>
      <button
        onClick={onLike}
        className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-green-400 hover:bg-green-500/20 hover:border-green-400 transition-all btn-press shadow-lg"
        aria-label="Like"
      >
        <Heart className="w-8 h-8" strokeWidth={2.5} />
      </button>
    </div>
  );
}
