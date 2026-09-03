export type RegionId = "center" | "park" | "river" | "forest" | "industrial" | "residential";

export type DiscoveryKind =
  | "waste"
  | "water"
  | "deforestation"
  | "pollution"
  | "water-waste"
  | "species"
  | "preservation"
  | "sustainable";

export type Rarity = "comum" | "incomum" | "raro" | "lendário";

export interface Discovery {
  id: string;
  region: RegionId;
  kind: DiscoveryKind;
  title: string;
  description: string;
  impact: "baixo" | "médio" | "alto" | "crítico";
  xp: number;
  position: [number, number, number];
  icon: string;
  isSpecies?: boolean;
  species?: {
    name: string;
    habitat: string;
    curiosity: string;
    rarity: Rarity;
    isFictional: boolean;
  };
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  objective: string;
  progress: number;
  target: number;
  reward: number;
  difficulty: "fácil" | "média" | "difícil";
  category: "exploração" | "biodiversidade" | "ação";
  completed: boolean;
  claimed?: boolean;
}

export interface GameState {
  profile: {
    id: string;
    name: string;
    level: number;
    levelName: string;
    xp: number;
    nextLevelXp: number;
    streak: number;
  };
  discoveries: Discovery[];
  visitedRegions: RegionId[];
  missions: Mission[];
  soundEnabled: boolean;
  startedAt: string;
  lastSavedAt?: string;
}

export interface ApiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PulseResponse {
  message: string;
  suggestions: string[];
  source: "local" | "ai";
}
