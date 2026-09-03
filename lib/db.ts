import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import type { GameState } from "./types";
import { createInitialState, getLevelForXp, getNextLevelXp, syncMissions } from "./game";

const configuredPath = process.env.DATABASE_PATH ?? "./data/eco-pulse.sqlite";
const databasePath = path.isAbsolute(configuredPath) ? configuredPath : path.join(process.cwd(), configuredPath);
let database: Database.Database | null = null;

function getDatabase() {
  if (database) return database;
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  database = new Database(databasePath);
  database.pragma("journal_mode = WAL");
  database.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      level INTEGER NOT NULL,
      xp INTEGER NOT NULL,
      streak INTEGER NOT NULL DEFAULT 1,
      started_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS discovery_logs (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      region TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mission_logs (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      profile_id TEXT PRIMARY KEY,
      sound_enabled INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS region_visits (
      profile_id TEXT NOT NULL,
      region TEXT NOT NULL,
      visited_at TEXT NOT NULL,
      PRIMARY KEY (profile_id, region)
    );
  `);
  return database;
}

export function loadGameState(): GameState {
  const db = getDatabase();
  const profile = db.prepare("SELECT * FROM profiles WHERE id = ?").get("local-explorer") as { id: string; name: string; level: number; xp: number; streak: number; started_at: string } | undefined;
  if (!profile) return createInitialState();
  const discoveries = db.prepare("SELECT payload FROM discovery_logs WHERE profile_id = ? ORDER BY created_at ASC").all(profile.id) as { payload: string }[];
  const missions = db.prepare("SELECT payload FROM mission_logs WHERE profile_id = ? ORDER BY id ASC").all(profile.id) as { payload: string }[];
  const visits = db.prepare("SELECT region FROM region_visits WHERE profile_id = ? ORDER BY visited_at ASC").all(profile.id) as { region: GameState["visitedRegions"][number] }[];
  const settings = db.prepare("SELECT sound_enabled FROM settings WHERE profile_id = ?").get(profile.id) as { sound_enabled: number } | undefined;
  const base = createInitialState();
  const level = getLevelForXp(profile.xp);
  const persistedDiscoveries = discoveries.map((item) => JSON.parse(item.payload));
  const visitedRegions = visits.length ? visits.map((item) => item.region) : [...new Set(persistedDiscoveries.map((item) => item.region))];
  return syncMissions({
    ...base,
    profile: { ...base.profile, id: profile.id, name: profile.name, level: level.level, levelName: level.name, xp: profile.xp, nextLevelXp: getNextLevelXp(profile.xp), streak: profile.streak },
    discoveries: persistedDiscoveries,
    visitedRegions,
    missions: missions.map((item) => JSON.parse(item.payload)),
    soundEnabled: settings ? Boolean(settings.sound_enabled) : true,
    startedAt: profile.started_at
  });
}

export function saveGameState(state: GameState) {
  const db = getDatabase();
  const now = new Date().toISOString();
  const save = db.transaction((nextState: GameState) => {
    db.prepare(`INSERT INTO profiles (id, name, level, xp, streak, started_at, updated_at) VALUES (@id, @name, @level, @xp, @streak, @startedAt, @updatedAt)
      ON CONFLICT(id) DO UPDATE SET name=@name, level=@level, xp=@xp, streak=@streak, updated_at=@updatedAt`).run({
      id: nextState.profile.id,
      name: nextState.profile.name,
      level: nextState.profile.level,
      xp: nextState.profile.xp,
      streak: nextState.profile.streak,
      startedAt: nextState.startedAt,
      updatedAt: now
    });
    db.prepare("DELETE FROM discovery_logs WHERE profile_id = ?").run(nextState.profile.id);
    const addDiscovery = db.prepare("INSERT INTO discovery_logs (id, profile_id, region, payload, created_at) VALUES (?, ?, ?, ?, ?)");
    for (const discovery of nextState.discoveries) addDiscovery.run(discovery.id, nextState.profile.id, discovery.region, JSON.stringify(discovery), now);
    db.prepare("DELETE FROM mission_logs WHERE profile_id = ?").run(nextState.profile.id);
    const addMission = db.prepare("INSERT INTO mission_logs (id, profile_id, payload, updated_at) VALUES (?, ?, ?, ?)");
    for (const mission of nextState.missions) addMission.run(mission.id, nextState.profile.id, JSON.stringify(mission), now);
    db.prepare("DELETE FROM region_visits WHERE profile_id = ?").run(nextState.profile.id);
    const addVisit = db.prepare("INSERT INTO region_visits (profile_id, region, visited_at) VALUES (?, ?, ?)");
    for (const region of nextState.visitedRegions) addVisit.run(nextState.profile.id, region, now);
    db.prepare(`INSERT INTO settings (profile_id, sound_enabled) VALUES (?, ?) ON CONFLICT(profile_id) DO UPDATE SET sound_enabled=excluded.sound_enabled`).run(nextState.profile.id, nextState.soundEnabled ? 1 : 0);
  });
  save(state);
  return { ...state, lastSavedAt: now };
}

export function resetGameState() {
  const db = getDatabase();
  db.prepare("DELETE FROM discovery_logs WHERE profile_id = ?").run("local-explorer");
  db.prepare("DELETE FROM mission_logs WHERE profile_id = ?").run("local-explorer");
  db.prepare("DELETE FROM profiles WHERE id = ?").run("local-explorer");
  db.prepare("DELETE FROM settings WHERE profile_id = ?").run("local-explorer");
  db.prepare("DELETE FROM region_visits WHERE profile_id = ?").run("local-explorer");
  return createInitialState();
}
