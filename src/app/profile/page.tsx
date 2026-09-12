"use client";

import { FormEvent, useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { DEFAULT_USER_PROFILE, readUserProfile, saveUserProfile } from "@/lib/storage";
import { UserProfile } from "@/lib/types";
import { Check, Edit3, HelpCircle, Shield, SlidersHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";

const interestOptions = ["Travel", "Music", "Tech", "Fitness", "Art", "Coffee", "Cooking", "Reading", "Movies", "Gaming"];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => setProfile(readUserProfile()), []);

  const update = (patch: Partial<UserProfile>) => setProfile((current) => ({ ...current, ...patch }));
  const toggleInterest = (interest: string) => update({ interests: profile.interests.includes(interest) ? profile.interests.filter((item) => item !== interest) : [...profile.interests, interest] });
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    saveUserProfile(profile);
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  const resetDemo = () => {
    localStorage.removeItem("spark-demo-matches");
    localStorage.removeItem("spark-demo-seen");
    localStorage.removeItem("lovenorth-messages");
    window.location.href = "/discover";
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] pb-24 max-w-lg mx-auto">
      <header className="px-5 py-5 flex items-center justify-between">
        <div><p className="text-xs uppercase tracking-[0.2em] text-[#ff7a8a]">Your space</p><h1 className="text-2xl font-bold">Profile</h1></div>
        <button onClick={() => setEditing((value) => !value)} className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white/80" aria-label="Edit profile"><Edit3 className="w-5 h-5" /></button>
      </header>
      <main className="px-4 space-y-5">
        <section className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#252027] to-[#17161b] border border-white/10">
          <div className="relative h-56"><img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#17161b] via-transparent to-transparent" />{profile.verified && <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-400 text-black text-xs font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>}</div>
          <div className="px-5 pb-5 -mt-8 relative"><div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#17161b] ring-2 ring-[#ff4458]"><img src={profile.photos[0]} alt="Profile avatar" className="w-full h-full object-cover" /></div><h2 className="mt-3 text-2xl font-bold">{profile.name}, {profile.age}</h2><p className="text-sm text-white/50">{profile.location} · {profile.datingGoal}</p><p className="mt-4 text-white/70 text-sm leading-relaxed">{profile.bio}</p><div className="mt-4 flex flex-wrap gap-2">{profile.interests.map((tag) => <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">{tag}</span>)}</div></div>
        </section>
        {saved && <div className="rounded-2xl bg-emerald-400/15 border border-emerald-400/30 text-emerald-200 px-4 py-3 text-sm">Your profile was updated.</div>}
        {editing ? (
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white/5 border border-white/10 p-5 space-y-4">
            <h2 className="text-lg font-semibold">Edit your profile</h2>
            <label className="block text-sm text-white/60">Name<input value={profile.name} onChange={(e) => update({ name: e.target.value })} className="mt-2 w-full h-12 rounded-xl bg-black/20 border border-white/10 px-3 text-white outline-none focus:border-[#ff4458]" required /></label>
            <label className="block text-sm text-white/60">Age<input type="number" min="18" max="99" value={profile.age} onChange={(e) => update({ age: Number(e.target.value) })} className="mt-2 w-full h-12 rounded-xl bg-black/20 border border-white/10 px-3 text-white outline-none focus:border-[#ff4458]" required /></label>
            <label className="block text-sm text-white/60">Location<input value={profile.location} onChange={(e) => update({ location: e.target.value })} className="mt-2 w-full h-12 rounded-xl bg-black/20 border border-white/10 px-3 text-white outline-none focus:border-[#ff4458]" /></label>
            <label className="block text-sm text-white/60">Bio<textarea value={profile.bio} onChange={(e) => update({ bio: e.target.value })} rows={3} className="mt-2 w-full rounded-xl bg-black/20 border border-white/10 p-3 text-white outline-none focus:border-[#ff4458] resize-none" maxLength={180} /></label>
            <label className="block text-sm text-white/60">Dating goal<select value={profile.datingGoal} onChange={(e) => update({ datingGoal: e.target.value })} className="mt-2 w-full h-12 rounded-xl bg-black/20 border border-white/10 px-3 text-white outline-none"><option>Something meaningful</option><option>Long-term relationship</option><option>Something casual</option><option>Still figuring it out</option></select></label>
            <div><p className="text-sm text-white/60 mb-2">Interests</p><div className="flex flex-wrap gap-2">{interestOptions.map((interest) => <button type="button" key={interest} onClick={() => toggleInterest(interest)} className={`px-3 py-2 rounded-full text-xs border ${profile.interests.includes(interest) ? "bg-[#ff4458] border-[#ff4458] text-white" : "bg-white/5 border-white/10 text-white/60"}`}>{interest}</button>)}</div></div>
            <label className="flex items-center justify-between rounded-2xl bg-white/5 p-4 text-sm"><span><span className="block text-white font-medium">Profile verification</span><span className="text-white/50">Add a verified badge to your profile</span></span><input type="checkbox" checked={profile.verified} onChange={(e) => update({ verified: e.target.checked })} className="h-5 w-5 accent-[#ff4458]" /></label>
            <button className="w-full h-12 rounded-2xl bg-[#ff4458] font-semibold btn-press">Save profile</button>
          </form>
        ) : (
          <div className="space-y-1">
            <Link href="/onboarding" className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/5"><SlidersHorizontal className="w-5 h-5 text-[#ff7a8a]" /><span className="flex-1 font-medium">Dating preferences</span><span className="text-white/30">›</span></Link>
            <button onClick={() => { update({ verified: true }); saveUserProfile({ ...profile, verified: true }); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/5 text-left"><Shield className="w-5 h-5 text-emerald-300" /><span className="flex-1"><span className="block font-medium">Verify your profile</span><span className="block text-xs text-white/40">{profile.verified ? "Your profile is verified" : "Build trust with a quick demo verification"}</span></span><span className="text-white/30">›</span></button>
            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/5 text-left"><HelpCircle className="w-5 h-5 text-white/50" /><span className="font-medium">Help & support</span></button>
          </div>
        )}
        <button onClick={resetDemo} className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/60"><Trash2 className="w-4 h-4" /> Reset demo data</button>
        <p className="text-center text-xs text-white/30">lovenorth · Built by Jolomi Dudu</p>
      </main>
      <BottomNav />
    </div>
  );
}
