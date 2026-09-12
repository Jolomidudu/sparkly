"use client";

import { useState } from "react";
import { Check, MapPin, X } from "lucide-react";
import { Profile } from "@/lib/types";

export default function ProfileDetailModal({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
      <button className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-label="Close profile" />
      <section className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#18171c] border border-white/10 shadow-2xl">
        <div className="relative h-80">
          <img src={profile.photos[photoIndex]} alt={profile.name} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 right-3 flex gap-1.5">{profile.photos.map((_, index) => <button key={index} onClick={() => setPhotoIndex(index)} className={`h-1 flex-1 rounded-full ${index === photoIndex ? "bg-white" : "bg-white/30"}`} aria-label={`View photo ${index + 1}`} />)}</div>
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center" aria-label="Close"><X className="w-5 h-5" /></button>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#18171c] to-transparent" />
        </div>
        <div className="px-5 pb-7 -mt-3 relative">
          <div className="flex items-center gap-2"><h2 className="text-3xl font-bold">{profile.name}, {profile.age}</h2>{profile.verified && <Check className="w-5 h-5 p-0.5 rounded-full bg-emerald-400 text-black" />}</div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-white/55"><MapPin className="w-4 h-4" />{profile.location} · {profile.distance} km away</div>
          <p className="mt-5 text-white/75 leading-relaxed">{profile.bio}</p>
          {profile.prompt && profile.promptAnswer && <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10"><p className="text-xs text-[#ff7a8a] uppercase tracking-wider">{profile.prompt}</p><p className="mt-2 font-medium">{profile.promptAnswer}</p></div>}
          {(profile.occupation || profile.education) && <div className="mt-5 space-y-2 text-sm text-white/60">{profile.occupation && <p>Works as {profile.occupation}</p>}{profile.education && <p>Studied at {profile.education}</p>}</div>}
          <div className="mt-5 flex flex-wrap gap-2">{profile.interests.map((interest) => <span key={interest} className="px-3 py-1.5 rounded-full bg-white/10 text-xs">{interest}</span>)}</div>
        </div>
      </section>
    </div>
  );
}
