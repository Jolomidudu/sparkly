import { UserProfile } from "./types";

export const STORAGE_KEYS = {
  matches: "spark-demo-matches",
  seen: "spark-demo-seen",
  userProfile: "lovenorth-user-profile",
  messages: "lovenorth-messages",
  blocked: "lovenorth-blocked",
} as const;

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Alex",
  age: 27,
  bio: "Curious, kind, and always looking for the next good conversation.",
  location: "Lagos",
  photos: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
  ],
  interests: ["Travel", "Music", "Tech", "Fitness"],
  datingGoal: "Something meaningful",
  minAge: 22,
  maxAge: 35,
  maxDistance: 25,
  verified: false,
};

export function readUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_USER_PROFILE;

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.userProfile);
    return saved ? { ...DEFAULT_USER_PROFILE, ...JSON.parse(saved) } : DEFAULT_USER_PROFILE;
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(profile));
}