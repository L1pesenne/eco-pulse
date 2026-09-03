"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Activity, AudioLines, BookOpen, ChevronRight, Compass, Eye, Leaf, LoaderCircle, Map, MessageCircle, RotateCcw, Shield, Sparkles, Target, Volume2, VolumeX } from "lucide-react";
import { LandingScreen } from "./LandingScreen";
import { DiscoveryModal } from "./DiscoveryModal";
import { JournalPanel } from "./JournalPanel";
import { MissionPanel } from "./MissionPanel";
import { ProgressBar } from "./ProgressBar";
import { PulseChat } from "./PulseChat";
import { addDiscovery, applyMissionRewards, awardXp, createInitialState, getProgressPercent, syncMissions } from "@/lib/game";
import { getDiscoveriesForRegion, REGION_META, REGION_ORDER } from "@/lib/world";
import type { Discovery, GameState, RegionId } from "@/lib/types";

const GameMap = dynamic(() => import("./GameMap").then((module) => module.GameMap), { ssr: false, loading: () => <div className="grid h-full min-h-[360px] place-items-center rounded-2xl bg-[#0d2523] text-xs text-[#78988a]"><LoaderCircle className="mr-2 animate-spin" size={16} /> preparando a cidade...</div> });

type View = "map" | "journal" | "missions" | "pulse";

export function EcoPulseApp() {
  const [state, setState] = useState<GameState | null>(null);
  const [landing, setLanding] = useState(true);
  const [activeRegion, setActiveRegion] = useState<RegionId>("center");
  const [view, setView] = useState<View>("map");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<{ discovery: Discovery; isNew: boolean; levelUp: boolean } | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    void fetch("/api/game").then(async (response) => {
      if (!response.ok) throw new Error("load");
      const payload = await response.json() as { state: GameState };
      setState(payload.state);
    }).catch(() => setError("Não foi possível abrir o diário local. Você ainda pode iniciar uma sessão nova.")).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 3600); return () => window.clearTimeout(timer); }, [toast]);

  async function persist(nextState: GameState) {
    setState(nextState); setSaving(true);
    try {
      const response = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", state: nextState }) });
      if (!response.ok) throw new Error("save");
      const payload = await response.json() as { state: GameState };
      setState(payload.state);
    } catch { setToast("Sessão local ativa — não conseguimos sincronizar o último sinal."); }
    finally { setSaving(false); }
  }

  async function beginExploration() {
    if (!state) { const initial = createInitialState(); setState(initial); await persist(initial); }
    setLanding(false);
  }

  async function newExploration() {
    setSaving(true);
    try {
      const response = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reset" }) });
      const payload = await response.json() as { state: GameState };
      setState(payload.state); setActiveRegion("center"); setView("map"); setToast("Uma nova expedição foi preparada.");
    } catch { setToast("Não foi possível reiniciar agora."); }
    finally { setSaving(false); }
  }

  async function exploreRegion(region: RegionId) {
    setActiveRegion(region);
    if (!state || state.visitedRegions.includes(region)) return;
    const candidate = syncMissions(awardXp({ ...state, visitedRegions: [...state.visitedRegions, region] }, 45));
    const next = applyMissionRewards(state, candidate);
    await persist(next);
    setToast(`Região descoberta · +45 XP · ${REGION_META[region].label}`);
  }

  async function registerDiscovery(discovery: Discovery) {
    if (!state) return;
    const result = addDiscovery(state, discovery);
    if (state.soundEnabled) playSignal();
    setSelected({ discovery, isNew: result.isNew, levelUp: result.levelUp });
    setActiveRegion(discovery.region);
    if (result.isNew) { await persist(result.state); setToast(`Novo sinal registrado · +${discovery.xp} XP`); }
  }

  function playSignal() {
    try {
      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(620, audio.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audio.currentTime + 0.12);
      gain.gain.setValueAtTime(0.045, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.22);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + 0.22);
      window.setTimeout(() => void audio.close(), 320);
    } catch { /* audio is an enhancement; the exploration remains fully usable */ }
  }

  async function toggleSound() {
    if (!state) return;
    await persist({ ...state, soundEnabled: !state.soundEnabled });
  }

  const discoveredIds = useMemo(() => new Set((state?.discoveries ?? []).map((item) => item.id)), [state?.discoveries]);
  const activeMeta = REGION_META[activeRegion];
  const regionDiscoveries = getDiscoveriesForRegion(activeRegion);

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#081413] text-[#b9ff76]"><div className="flex items-center gap-3 text-sm"><LoaderCircle className="animate-spin" size={18} /> iniciando protocolo...</div></div>;
  if (landing || !state) return <><LandingScreen onStart={() => void beginExploration()} busy={false} />{error && <div className="fixed bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-xl border border-[#ef9569]/30 bg-[#241714] px-4 py-3 text-xs text-[#ffc09b]">{error}</div>}</>;

  return <main className="min-h-screen bg-[#081413] text-[#dce9e2]">
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col">
      <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-white/8 px-4 sm:px-7 lg:px-10"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl border border-[#b9ff76]/30 bg-[#b9ff76]/10 text-[#b9ff76]"><Activity size={17} /></div><div><div className="text-sm font-semibold tracking-[0.21em] text-[#eaffef]">ECO<span className="text-[#b9ff76]">//</span>PULSE</div><div className="hidden text-[9px] uppercase tracking-[0.16em] text-[#648278] sm:block">protocolo de exploração ambiental</div></div></div><div className="hidden items-center gap-2 md:flex"><div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[.035] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-[#78968b]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b9ff76]" /> cidade sincronizada</div><button onClick={() => void toggleSound()} aria-label={state.soundEnabled ? "Desligar som" : "Ligar som"} className="rounded-lg p-2 text-[#78968b] transition hover:bg-white/10 hover:text-[#dce9e2]">{state.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}</button></div><div className="flex items-center gap-2"><div className="hidden text-right sm:block"><div className="text-[10px] font-medium text-[#dceee1]">{state.profile.name}</div><div className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-[#6f8e82]">{state.profile.levelName}</div></div><div className="grid h-9 w-9 place-items-center rounded-full border border-[#b9ff76]/25 bg-[#b9ff76]/10 text-xs font-semibold text-[#b9ff76]">{state.profile.level}</div></div></header>
      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(0,1fr)_340px] lg:grid-cols-[minmax(0,1fr)_385px]">
        <section className="min-w-0 p-4 pb-24 sm:p-6 sm:pb-28 lg:p-8 lg:pb-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#6e9083]"><Map size={12} className="text-[#b9ff76]" /> atlas de campo <span className="text-[#3d5a50]">/</span> setor {String(REGION_ORDER.indexOf(activeRegion) + 1).padStart(2, "0")}</div><h1 className="text-2xl font-semibold tracking-[-0.05em] text-[#efffe9] sm:text-3xl">A cidade está em escuta<span className="text-[#b9ff76]">.</span></h1></div><div className="flex items-center gap-2"><div className="rounded-xl border border-white/8 bg-white/[.035] px-3 py-2"><div className="flex items-center gap-2 text-[10px] text-[#94b0a4]"><Shield size={13} className="text-[#b9ff76]" /> nível {state.profile.level} · {state.profile.levelName}</div><ProgressBar value={getProgressPercent(state.profile)} className="mt-2 w-32" /></div><button onClick={() => void newExploration()} className="hidden rounded-xl border border-white/10 p-2.5 text-[#739186] transition hover:border-[#ef9569]/35 hover:text-[#ffc09b] sm:block" title="Nova expedição"><RotateCcw size={15} /></button></div></div>
          <div className="relative h-[min(58vh,570px)] min-h-[410px] overflow-hidden rounded-2xl border border-white/10 shadow-panel"><GameMap activeRegion={activeRegion} discoveredIds={discoveredIds} onRegionSelect={(region) => void exploreRegion(region)} onDiscover={(discovery) => void registerDiscovery(discovery)} /><div className="pointer-events-none absolute bottom-4 left-4 max-w-[min(320px,calc(100%-32px))] rounded-2xl border border-white/10 bg-[#071513]/85 p-3.5 backdrop-blur-xl sm:bottom-5 sm:left-5"><div className="mb-1 text-[9px] font-medium uppercase tracking-[0.2em]" style={{ color: activeMeta.accent }}>{activeMeta.eyebrow}</div><div className="text-sm font-semibold text-[#e9f8ed]">{activeMeta.label}</div><p className="mt-1 text-[10px] leading-4 text-[#91aaa0]">{activeMeta.description}</p><div className="mt-2 flex items-center gap-2 text-[9px] text-[#719084]"><span className="h-1.5 w-1.5 rounded-full bg-[#b9ff76]" /> {state.discoveries.filter((item) => item.region === activeRegion).length}/{regionDiscoveries.length} sinais registrados</div></div></div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{REGION_ORDER.map((region) => <button key={region} onClick={() => void exploreRegion(region)} className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-[10px] transition ${activeRegion === region ? "border-[#b9ff76]/30 bg-[#b9ff76]/[.08] text-[#d9ffc0]" : "border-white/8 bg-white/[.025] text-[#78978b] hover:text-[#cde2d6]"}`}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: REGION_META[region].color }} />{REGION_META[region].label}<span className="font-mono text-[9px] opacity-60">{state.discoveries.filter((item) => item.region === region).length}/2</span></button>)}</div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3"><InsightCard icon={<Eye size={15} />} label="sinais coletados" value={String(state.discoveries.length).padStart(2, "0")} detail="de 12 disponíveis" color="aqua" /><InsightCard icon={<Compass size={15} />} label="território lido" value={`${Math.round((state.visitedRegions.length / 6) * 100)}%`} detail={`${state.visitedRegions.length} de 6 regiões`} color="moss" /><InsightCard icon={<Sparkles size={15} />} label="sequência ativa" value={`${state.profile.streak} dia`} detail="continue observando" color="amber" /></div>
        </section>
        <aside className="hidden min-h-0 border-l border-white/8 bg-[#0a1b1a]/70 p-5 md:flex md:flex-col lg:p-6">{view === "map" && <><div className="mb-5 flex items-center justify-between"><div><div className="text-[10px] uppercase tracking-[0.2em] text-[#6d8e82]">painel de campo</div><div className="mt-1 text-base font-semibold text-[#e8fae9]">Próximos movimentos</div></div><div className="rounded-lg bg-[#b9ff76]/10 p-2 text-[#b9ff76]"><AudioLines size={15} /></div></div><div className="min-h-0 flex-1 space-y-6"><div className="min-h-[270px] flex-1"><MissionPanel missions={state.missions} compact /></div><div className="border-t border-white/8 pt-5"><PulseChat state={state} compact /></div></div></>}{view === "journal" && <JournalPanel state={state} />}{view === "missions" && <MissionPanel missions={state.missions} />}{view === "pulse" && <PulseChat state={state} />}</aside>
      </div>
      {view !== "map" && <div className="glass fixed inset-x-3 bottom-[76px] top-[82px] z-20 flex min-h-0 flex-col rounded-2xl p-4 md:hidden">{view === "journal" && <JournalPanel state={state} />}{view === "missions" && <MissionPanel missions={state.missions} />}{view === "pulse" && <PulseChat state={state} />}</div>}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#081413]/92 px-3 py-2 backdrop-blur-xl md:static md:border-0 md:bg-transparent md:px-8 md:pb-6"><div className="mx-auto flex max-w-lg items-center justify-between rounded-2xl border border-white/10 bg-[#102320]/90 p-1.5 shadow-2xl md:max-w-none md:justify-start md:gap-2 md:bg-transparent md:p-0 md:shadow-none">{([{ id: "map", label: "Mapa", icon: <Map size={16} /> }, { id: "journal", label: "Diário", icon: <BookOpen size={16} /> }, { id: "missions", label: "Missões", icon: <Target size={16} /> }, { id: "pulse", label: "PULSE", icon: <MessageCircle size={16} /> }] as { id: View; label: string; icon: React.ReactNode }[]).map((item) => <button key={item.id} onClick={() => setView(item.id)} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[10px] transition md:flex-none md:px-4 ${view === item.id ? "bg-[#b9ff76] font-semibold text-[#0b1717]" : "text-[#83a095] hover:bg-white/10 hover:text-[#dcefe2]"}`}>{item.icon}<span>{item.label}</span>{item.id === "pulse" && <span className={`h-1.5 w-1.5 rounded-full ${view === "pulse" ? "bg-[#0b1717]" : "bg-[#7de7d4]"}`} />}</button>)}<button onClick={() => void toggleSound()} className="grid h-9 w-9 place-items-center rounded-xl text-[#83a095] md:hidden">{state.soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}</button></div></nav>
    </div>
    {saving && <div className="fixed right-4 top-4 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-[#102521]/90 px-3 py-2 text-[10px] text-[#9db8ac] shadow-xl backdrop-blur-md"><LoaderCircle size={12} className="animate-spin text-[#b9ff76]" /> salvando diário</div>}
    {toast && <div className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#b9ff76]/20 bg-[#142b24]/95 px-4 py-2.5 text-[10px] text-[#d9f7c4] shadow-2xl backdrop-blur-md md:bottom-7"><Sparkles size={13} className="text-[#b9ff76]" /> {toast}</div>}
    {selected && <DiscoveryModal discovery={selected.discovery} isNew={selected.isNew} levelUp={selected.levelUp} onClose={() => setSelected(null)} />}
  </main>;
}

function InsightCard({ icon, label, value, detail, color }: { icon: React.ReactNode; label: string; value: string; detail: string; color: "aqua" | "moss" | "amber" }) {
  const colors = { aqua: "text-[#7de7d4]", moss: "text-[#b9ff76]", amber: "text-[#e8c77b]" };
  return <div className="rounded-2xl border border-white/8 bg-[#0e211f]/70 p-3.5"><div className={`flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] ${colors[color]}`}>{icon}{label}</div><div className="mt-2 flex items-baseline gap-2"><span className="text-xl font-semibold tracking-[-0.05em] text-[#e8f8ed]">{value}</span><span className="text-[9px] text-[#67867b]">{detail}</span></div></div>;
}
