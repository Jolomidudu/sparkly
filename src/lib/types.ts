export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  photos: string[];
  interests: string[];
  distance: number; // km
}

export interface Match {
  id: string;
  profile: Profile;
  matchedAt: string;
  lastMessage?: string;
}
