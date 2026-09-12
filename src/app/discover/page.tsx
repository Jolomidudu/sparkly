"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DEMO_PROFILES } from "@/data/profiles";
import { Profile, Match } from "@/lib/types";
import SwipeCard, { ActionButtons } from "@/components/SwipeCard";
import MatchModal from "@/components/MatchModal";
import ProfileDetailModal from "@/components/ProfileDetailModal";
import BottomNav from "@/components/BottomNav";
import { Heart, SlidersHorizontal, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { readUserProfile } from "@/lib/storage";

const STORAGE_KEY = "spark-demo-matches";
const SEEN_KEY = "spark-demo-seen";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Profile | null>(null);
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(25);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(60);
  const [lastSwiped, setLastSwiped] = useState<Profile | null>(null);
  const [notice, setNotice] = useState("");
  const [ready, setReady] = useState(false);

  const filteredProfiles = useMemo(
    () => profiles.filter((profile) => profile.distance <= maxDistance && profile.age >= minAge && profile.age <= maxAge && (!showVerifiedOnly || profile.verified)),
    [profiles, maxDistance, minAge, maxAge, showVerifiedOnly]
  );

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

  useEffect(() => {
    const preferences = readUserProfile();
    setMaxDistance(preferences.maxDistance);
    setMinAge(preferences.minAge);
    setMaxAge(preferences.maxAge);
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
      setLastSwiped(current);

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

  const rewind = () => {
    if (!lastSwiped) return;
    setProfiles((current) => [lastSwiped, ...current]);
    setLastSwiped(null);
    setNotice("Last profile restored");
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };

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
        <div className="flex items-center gap-3"><button onClick={() => setShowFilters(true)} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/70" aria-label="Open filters"><SlidersHorizontal className="w-4 h-4" /></button><Link href="/matches" className="relative text-sm text-white/60 hover:text-white">
          {matches.length > 0 && (
            <span className="absolute -top-1.5 -right-3 w-5 h-5 rounded-full bg-[#ff4458] text-[10px] font-bold flex items-center justify-center">
              {matches.length}
            </span>
          )}
          Matches
        </Link></div>
      </header>

      <div className="px-5 pb-3 flex items-center justify-between"><p className="text-xs text-white/40">{filteredProfiles.length} profiles fit your preferences</p><div className="flex gap-2"><button onClick={rewind} disabled={!lastSwiped} className="text-xs text-white/50 disabled:opacity-30">Undo</button><button onClick={() => showNotice("Boost active for the next 30 minutes")} className="text-xs text-[#ffb45c] flex items-center gap-1"><Zap className="w-3 h-3" /> Boost</button></div></div>
      {notice && <div className="mx-5 mb-3 rounded-xl bg-[#ff4458]/15 border border-[#ff4458]/30 px-3 py-2 text-xs text-[#ffb8c0]">{notice}</div>}

      {/* Cards area */}
      <div className="flex-1 px-4 flex flex-col">
        <div className="relative w-full aspect-[3/4.2] max-h-[62vh]">
          {filteredProfiles.length === 0 ? (
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
              {filteredProfiles.slice(0, 2).reverse().map((p, i, arr) => (
                <SwipeCard
                  key={p.id}
                  profile={p}
                  onSwipe={handleSwipe}
                  onOpenDetails={setDetailProfile}
                  isTop={i === arr.length - 1}
                />
              ))}
            </>
          )}
        </div>

        {filteredProfiles.length > 0 && (
          <ActionButtons
            onNope={() => handleSwipe("left")}
            onLike={() => handleSwipe("right")}
            onSuperLike={() => { if (filteredProfiles[0]) { handleSwipe("right"); showNotice("Super Like sent"); } }}
            onRewind={rewind}
            canRewind={Boolean(lastSwiped)}
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
      {detailProfile && <ProfileDetailModal profile={detailProfile} onClose={() => setDetailProfile(null)} />}
      {showFilters && <div className="fixed inset-0 z-[80] flex items-end justify-center"><button className="absolute inset-0 bg-black/70" onClick={() => setShowFilters(false)} aria-label="Close filters" /><section className="relative z-10 w-full max-w-lg rounded-t-3xl bg-[#1a191e] border border-white/10 p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Discovery filters</h2><button onClick={() => setShowFilters(false)} className="text-sm text-[#ff7a8a]">Done</button></div><label className="block mt-6 text-sm text-white/60">Age range: <span className="text-white">{minAge}–{maxAge}</span><div className="flex gap-3 mt-2"><input type="number" min="18" max={maxAge} value={minAge} onChange={(e) => setMinAge(Number(e.target.value))} className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3" /><input type="number" min={minAge} max="99" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))} className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3" /></div></label><label className="block mt-5 text-sm text-white/60">Distance: <span className="text-white">{maxDistance} km</span><input type="range" min="1" max="100" value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} className="mt-3 w-full accent-[#ff4458]" /></label><label className="mt-5 flex items-center justify-between rounded-2xl bg-white/5 p-4"><span className="text-sm font-medium">Verified profiles only</span><input type="checkbox" checked={showVerifiedOnly} onChange={(e) => setShowVerifiedOnly(e.target.checked)} className="h-5 w-5 accent-[#ff4458]" /></label></section></div>}
    </div>
  );
}
