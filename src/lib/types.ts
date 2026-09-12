export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  photos: string[];
  interests: string[];
  distance: number; // km
  prompt?: string;
  promptAnswer?: string;
  occupation?: string;
  education?: string;
  verified?: boolean;
}

export interface Match {
  id: string;
  profile: Profile;
  matchedAt: string;
  lastMessage?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  bio: string;
  location: string;
  photos: string[];
  interests: string[];
  datingGoal: string;
  minAge: number;
  maxAge: number;
  maxDistance: number;
  verified: boolean;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  sender: "me" | "them";
  text: string;
  sentAt: string;
}
