"use client";

import { useState, useEffect, useCallback } from "react";
import { DEMO_PROFILES } from "@/data/profiles";
import { Profile, Match } from "@/lib/types";
import SwipeCard, { ActionButtons } from "@/components/SwipeCard";
import MatchModal from "@/components/MatchModal";
import BottomNav from "@/components/BottomNav";
import { Heart } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "spark-demo-matches";
const SEEN_KEY = "spark-demo-seen";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    try {
      const savedMatches = localStorage.getItem(STORAGE_KEY);
      const seenIds = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]") as string[];
      if (savedMatches) setMatches(JSON.parse(savedMatches));

      // Filter out already seen profiles
      const remaining = DEMO_PROFILES.filter((p) => !seenIds.includes(p.id));
      setProfiles(remaining.length > 0 ? remaining : [...DEMO_PROFILES]);
    } catch {
      setProfiles([...DEMO_PROFILES]);
    }
    setReady(true);
  }, []);

  const saveSeen = useCallback((id: string) => {
    try {
      const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]") as string[];
      if (!seen.includes(id)) {
        seen.push(id);
        localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
      }
    } catch {}
  }, []);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (profiles.length === 0) return;
      const [current, ...rest] = profiles;

      saveSeen(current.id);

      if (direction === "right") {
        // 40% chance of mutual match for demo fun
        const isMatch = Math.random() < 0.45;
        if (isMatch) {
          const newMatch: Match = {
            id: `match-${current.id}`,
            profile: current,
            matchedAt: new Date().toISOString(),
            lastMessage: undefined,
          };
          const updated = [newMatch, ...matches];
          setMatches(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          setCurrentMatch(current);
        }
      }

      setProfiles(rest);
    },
    [profiles, matches, saveSeen]
  );

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f12]">
        <div className="w-10 h-10 border-2 border-[#ff4458] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] pb-20 flex flex-col max-w-lg mx-auto relative">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff4458] to-[#ff7a8a] flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-lg font-bold">lovenorth</span>
        </div>
        <Link
          href="/matches"
          className="relative text-sm text-white/60 hover:text-white"
        >
          {matches.length > 0 && (
            <span className="absolute -top-1.5 -right-3 w-5 h-5 rounded-full bg-[#ff4458] text-[10px] font-bold flex items-center justify-center">
              {matches.length}
            </span>
          )}
          Matches
        </Link>
      </header>

      {/* Cards area */}
      <div className="flex-1 px-4 flex flex-col">
        <div className="relative w-full aspect-[3/4.2] max-h-[62vh]">
          {profiles.length === 0 ? (
            <div className="absolute inset-0 rounded-3xl bg-[#1a1a1f] border border-white/10 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-xl font-semibold">No more profiles</h3>
              <p className="text-white/50 mt-2 text-sm">
                You&apos;ve seen everyone in this demo.
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem(SEEN_KEY);
                  setProfiles([...DEMO_PROFILES]);
                }}
                className="mt-6 px-6 h-11 rounded-xl bg-[#ff4458] text-white font-medium btn-press"
              >
                Reset Demo
              </button>
            </div>
          ) : (
            <>
              {/* Show next card underneath for depth */}
              {profiles.slice(0, 2).reverse().map((p, i, arr) => (
                <SwipeCard
                  key={p.id}
                  profile={p}
                  onSwipe={handleSwipe}
                  isTop={i === arr.length - 1}
                />
              ))}
            </>
          )}
        </div>

        {profiles.length > 0 && (
          <ActionButtons
            onNope={() => handleSwipe("left")}
            onLike={() => handleSwipe("right")}
          />
        )}
      </div>

      <BottomNav />

      {currentMatch && (
        <MatchModal
          profile={currentMatch}
          onClose={() => setCurrentMatch(null)}
        />
      )}
    </div>
  );
}
