import type { Discovery, GameState, Mission, RegionId } from "./types";

export const LEVELS = [
  { level: 1, name: "Observador", minXp: 0 },
  { level: 2, name: "Explorador", minXp: 350 },
  { level: 3, name: "Guardião", minXp: 850 },
  { level: 4, name: "Protetor", minXp: 1500 },
  { level: 5, name: "Eco-Líder", minXp: 2400 }
];

export function getLevelForXp(xp: number) {
  return [...LEVELS].reverse().find((item) => xp >= item.minXp) ?? LEVELS[0];
}

export function getNextLevelXp(xp: number) {
  return LEVELS.find((item) => item.minXp > xp)?.minXp ?? LEVELS[LEVELS.length - 1].minXp;
}

function mission(
  id: string,
  title: string,
  description: string,
  objective: string,
  progress: number,
  target: number,
  reward: number,
  difficulty: Mission["difficulty"],
  category: Mission["category"]
): Mission {
  return { id, title, description, objective, progress, target, reward, difficulty, category, completed: progress >= target, claimed: false };
}

export function buildMissions(state: Pick<GameState, "discoveries" | "visitedRegions">): Mission[] {
  const discovered = state.discoveries;
  const wasteInRiver = discovered.filter((item) => item.region === "river" && item.kind === "waste").length;
  const species = discovered.filter((item) => item.isSpecies).length;
  const environmentalProblems = discovered.filter((item) => ["waste", "water", "deforestation", "pollution", "water-waste"].includes(item.kind)).length;

  return [
    mission(
      "first-signal",
      "Primeiro sinal",
      "Comece a construir o mapa de saúde da cidade.",
      "Registrar 3 descobertas",
      discovered.length,
      3,
      180,
      "fácil",
      "exploração"
    ),
    mission(
      "city-circuit",
      "Circuito da cidade",
      "Uma visão ampla ajuda a conectar causas e consequências.",
      "Visitar 4 regiões",
      state.visitedRegions.length,
      4,
      260,
      "média",
      "exploração"
    ),
    mission(
      "river-watch",
      "Vigília do rio",
      wasteInRiver > 0 ? "O rio está apresentando sinais de degradação. Encontre três pontos críticos." : "Observe a bacia urbana e encontre três pontos críticos.",
      "Registrar 3 descobertas no Rio",
      discovered.filter((item) => item.region === "river").length,
      3,
      320,
      "difícil",
      "ação"
    ),
    mission(
      "biodiversity-log",
      "Caderno de biodiversidade",
      species > 0 ? "Você demonstrou interesse pela biodiversidade. Procure mais espécies diferentes." : "Procure sinais de vida para começar seu caderno de biodiversidade.",
      "Encontrar 2 espécies",
      species,
      2,
      300,
      "média",
      "biodiversidade"
    ),
    mission(
      "impact-map",
      "Mapa de impacto",
      "Conecte observações de diferentes regiões para formar uma leitura sistêmica.",
      "Identificar 5 problemas ambientais",
      environmentalProblems,
      5,
      350,
      "difícil",
      "ação"
    )
  ];
}

export function createInitialState(): GameState {
  const xp = 0;
  const level = getLevelForXp(xp);
  return {
    profile: {
      id: "local-explorer",
      name: "Explorador",
      level: level.level,
      levelName: level.name,
      xp,
      nextLevelXp: getNextLevelXp(xp),
      streak: 1
    },
    discoveries: [],
    visitedRegions: [],
    missions: buildMissions({ discoveries: [], visitedRegions: [] }),
    soundEnabled: true,
    startedAt: new Date().toISOString()
  };
}

export function awardXp(state: GameState, amount: number): GameState {
  const xp = state.profile.xp + amount;
  const level = getLevelForXp(xp);
  return {
    ...state,
    profile: { ...state.profile, xp, level: level.level, levelName: level.name, nextLevelXp: getNextLevelXp(xp) }
  };
}

export function addDiscovery(state: GameState, discovery: Discovery): { state: GameState; isNew: boolean; levelUp: boolean } {
  if (state.discoveries.some((item) => item.id === discovery.id)) return { state, isNew: false, levelUp: false };
  const beforeLevel = state.profile.level;
  const withXp = awardXp(state, discovery.xp);
  const visitedRegions = withXp.visitedRegions.includes(discovery.region) ? withXp.visitedRegions : [...withXp.visitedRegions, discovery.region];
  const next = syncMissions({
    ...withXp,
    discoveries: [...withXp.discoveries, discovery],
    visitedRegions,
    missions: state.missions,
    lastSavedAt: new Date().toISOString()
  });
  const newlyCompleted = next.missions.filter((item) => item.completed && !item.claimed && !state.missions.some((old) => old.id === item.id && old.completed));
  const reward = newlyCompleted.reduce((total, item) => total + item.reward, 0);
  const rewarded = reward ? awardXp(next, reward) : next;
  rewarded.missions = rewarded.missions.map((item) => newlyCompleted.some((completed) => completed.id === item.id) ? { ...item, claimed: true } : item);
  return { state: rewarded, isNew: true, levelUp: rewarded.profile.level > beforeLevel };
}

export function syncMissions(state: GameState): GameState {
  const generated = buildMissions(state);
  const current = generated.map((item) => {
    const old = state.missions.find((mission) => mission.id === item.id);
    return { ...item, completed: item.completed || Boolean(old?.completed), claimed: Boolean(old?.claimed) };
  });
  return { ...state, missions: current };
}

export function applyMissionRewards(before: GameState, after: GameState) {
  const newlyCompleted = after.missions.filter((item) => item.completed && !item.claimed && !before.missions.some((old) => old.id === item.id && old.completed));
  if (!newlyCompleted.length) return after;
  const reward = newlyCompleted.reduce((total, item) => total + item.reward, 0);
  return { ...awardXp(after, reward), missions: after.missions.map((item) => newlyCompleted.some((completed) => completed.id === item.id) ? { ...item, claimed: true } : item) };
}

export function getProgressPercent(profile: GameState["profile"]) {
  const currentMin = LEVELS.find((item) => item.level === profile.level)?.minXp ?? 0;
  if (profile.level === LEVELS[LEVELS.length - 1].level) return 100;
  return Math.min(100, Math.round(((profile.xp - currentMin) / (profile.nextLevelXp - currentMin)) * 100));
}

export function getRegionProgress(state: GameState, region: RegionId, total: number) {
  return Math.round((state.discoveries.filter((item) => item.region === region).length / total) * 100);
}
