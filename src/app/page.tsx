"use client";

import Link from "next/link";
import { Heart, Sparkles, MessageCircle, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ff4458]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff4458] to-[#ff7a8a] flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Sparkly</span>
        </div>
        <Link
          href="/discover"
          className="text-sm font-medium text-white/70 hover:text-white transition"
        >
          Skip intro →
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8">
          <Sparkles className="w-4 h-4 text-[#ff4458]" />
          Live Demo • No signup required
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-2xl leading-[1.1]">
          Find your next
          <span className="block bg-gradient-to-r from-[#ff4458] via-[#ff7a8a] to-pink-400 bg-clip-text text-transparent">
            connection
          </span>
        </h1>

        <p className="mt-5 text-lg text-white/60 max-w-md leading-relaxed">
          A polished, mobile-first dating experience. Swipe, match, and chat —
          all in a lightweight demo you can share.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link
            href="/discover"
            className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#ff4458] to-[#ff2d4a] text-white font-semibold text-lg flex items-center justify-center shadow-lg shadow-[#ff4458]/30 hover:shadow-[#ff4458]/50 transition-all btn-press"
          >
            Start Swiping
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            {
              icon: Heart,
              title: "Smart Swipes",
              desc: "Beautiful cards with real photos",
            },
            {
              icon: MessageCircle,
              title: "Instant Matches",
              desc: "See matches right away",
            },
            {
              icon: Shield,
              title: "Demo Safe",
              desc: "No real accounts needed",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white/5 border border-white/10 p-5 text-left backdrop-blur-sm"
            >
              <f.icon className="w-6 h-6 text-[#ff4458] mb-3" />
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-white/50 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-sm text-white/40">
        Built as a demo • Deployable on Vercel in minutes
      </footer>
    </div>
  );
}
