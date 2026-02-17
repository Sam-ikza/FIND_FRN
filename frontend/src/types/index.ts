export interface BudgetRange {
  min: number;
  max: number;
}

export interface Location {
  city: string;
  state: string;
  lat?: number;
  lng?: number;
}

export interface LifeIntent {
  lifeMode: 'growth' | 'chill' | 'balanced';
  lifeGoals: string[];
  dailyEnergyLevel: 'low' | 'medium' | 'high';
  struggleStabilityScale: number;
}

export interface CulturalOpenness {
  culturalPreference: 'comfort_zone' | 'mixed' | 'explorer';
  sameStatePreference: 'same_state_only' | 'open_to_all';
}

export interface User {
  _id?: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  budgetRange: BudgetRange;
  location: Location;
  moveInDate?: string;
  cleanlinessLevel: number;
  sleepSchedule: string;
  smoking: boolean;
  drinking: boolean;
  guestsFrequency: string;
  noiseTolerance: string;
  introvertExtrovertScale: number;
  weekendStyle: string;
  hobbies: string[];
  lifeIntent: LifeIntent;
  culturalOpenness: CulturalOpenness;
}

export interface Room {
  _id?: string;
  title: string;
  rent: number;
  location: Location;
  amenities: string[];
  images: string[];
  vacancyType: 'single' | 'shared';
  availableFrom: string;
  currentRoommates: User[] | string[];
  postedBy?: User | string;
  description: string;
}

export interface MatchBreakdownItem {
  score: number;
  max: number;
  details?: Record<string, any>;
}

export interface Conflict {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export interface Explanation {
  category: string;
  type: 'positive' | 'neutral' | 'negative';
  text: string;
}

export interface MatchResult {
  candidate: Partial<User>;
  matchScore: number;
  breakdown: Record<string, MatchBreakdownItem>;
  conflicts: Conflict[];
  explanations: Explanation[];
  linkedRooms: Partial<Room>[];
}
