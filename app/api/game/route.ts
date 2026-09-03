import { NextResponse } from "next/server";
import { loadGameState, resetGameState, saveGameState } from "@/lib/db";
import type { GameState } from "@/lib/types";
import { syncMissions } from "@/lib/game";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json({ state: loadGameState() });
  } catch (error) {
    console.error("Failed to load game state", error);
    return NextResponse.json({ error: "Não foi possível abrir o diário agora." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { action?: "save" | "reset"; state?: GameState };
    if (body.action === "reset") return NextResponse.json({ state: resetGameState() });
    if (!body.state) return NextResponse.json({ error: "Estado de exploração ausente." }, { status: 400 });
    return NextResponse.json({ state: saveGameState(syncMissions(body.state)) });
  } catch (error) {
    console.error("Failed to save game state", error);
    return NextResponse.json({ error: "Não foi possível salvar sua exploração." }, { status: 500 });
  }
}
