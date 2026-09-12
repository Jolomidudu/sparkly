"use client";

import { useState, useEffect } from "react";
import { Match } from "@/lib/types";
import BottomNav from "@/components/BottomNav";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "spark-demo-matches";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMatches(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f12]">
        <div className="w-10 h-10 border-2 border-[#ff4458] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] pb-24 max-w-lg mx-auto">
      <header className="px-5 py-5 sticky top-0 bg-[#0f0f12]/90 backdrop-blur-md z-10">
        <h1 className="text-2xl font-bold">Matches</h1>
        <p className="text-sm text-white/50 mt-0.5">
          {matches.length} connection{matches.length !== 1 ? "s" : ""}
        </p>
      </header>

      <div className="px-4">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center px-6">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5">
              <Heart className="w-10 h-10 text-white/25" />
            </div>
            <h2 className="text-xl font-semibold">No matches yet</h2>
            <p className="text-white/50 mt-2 text-sm max-w-xs">
              Keep swiping — when someone likes you back, they&apos;ll appear here.
            </p>
            <Link
              href="/discover"
              className="mt-8 px-8 h-12 rounded-2xl bg-gradient-to-r from-[#ff4458] to-[#ff2d4a] text-white font-semibold flex items-center btn-press"
            >
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 transition"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#ff4458]/40">
                  <img
                    src={m.profile.photos[0]}
                    alt={m.profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-white truncate">
                      {m.profile.name}
                    </h3>
                    <span className="text-sm text-white/50">{m.profile.age}</span>
                  </div>
                  <p className="text-sm text-white/50 truncate mt-0.5">
                    {m.lastMessage || "Say hello 👋"}
                  </p>
                </div>
                <button className="w-11 h-11 rounded-full bg-[#ff4458]/15 text-[#ff4458] flex items-center justify-center hover:bg-[#ff4458]/25 transition btn-press">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
