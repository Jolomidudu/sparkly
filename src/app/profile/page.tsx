"use client";

import BottomNav from "@/components/BottomNav";
import { Settings, LogOut, Shield, HelpCircle, Heart } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const clearDemo = () => {
    localStorage.removeItem("spark-demo-matches");
    localStorage.removeItem("spark-demo-seen");
    window.location.href = "/discover";
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] pb-24 max-w-lg mx-auto">
      <header className="px-5 py-5">
        <h1 className="text-2xl font-bold">Profile</h1>
      </header>

      {/* Demo user card */}
      <div className="px-4">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#1a1a1f] to-[#141418] border border-white/10">
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
              alt="You"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent" />
          </div>
          <div className="px-5 pb-5 -mt-8 relative">
            <div className="flex items-end gap-3">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#141418] ring-2 ring-[#ff4458]">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold">Alex, 27</h2>
                <p className="text-sm text-white/50">Demo User</p>
              </div>
            </div>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              This is a demo profile. In a real app you would edit your photos,
              bio, interests and preferences here.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Travel", "Music", "Tech", "Fitness"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-6 space-y-1">
          {[
            { icon: Settings, label: "Settings", href: "#" },
            { icon: Shield, label: "Safety & Privacy", href: "#" },
            { icon: HelpCircle, label: "Help & Support", href: "#" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left hover:bg-white/5 transition"
            >
              <item.icon className="w-5 h-5 text-white/50" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={clearDemo}
          className="mt-6 w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition btn-press"
        >
          <LogOut className="w-4 h-4" />
          Reset Demo Data
        </button>

        <p className="mt-8 text-center text-xs text-white/30">
          Sparkly Demo v0.1 • Built for Vercel
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
