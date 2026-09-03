"use client";

import { ArrowUpRight, BookOpen, Check, MapPin, Sparkles, X } from "lucide-react";
import { REGION_META } from "@/lib/world";
import type { Discovery } from "@/lib/types";

export function DiscoveryModal({ discovery, isNew, levelUp, onClose }: { discovery: Discovery; isNew: boolean; levelUp: boolean; onClose: () => void }) {
  const meta = REGION_META[discovery.region];
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center" onClick={onClose}>
    <div className="glass relative w-full max-w-lg overflow-hidden rounded-3xl p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()}>
      <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full blur-3xl" style={{ backgroundColor: `${meta.color}38` }} />
      <button onClick={onClose} aria-label="Fechar descoberta" className="absolute right-4 top-4 rounded-full p-2 text-[#8fa49d] transition hover:bg-white/10 hover:text-white"><X size={17} /></button>
      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-3 pr-7">
          <div><div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.23em]" style={{ color: meta.accent }}><MapPin size={12} /> {meta.label}</div><h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#efffe8] sm:text-3xl">{discovery.title}</h2></div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[.06] text-2xl" style={{ color: meta.accent }}>{discovery.icon}</div>
        </div>
        <div className="mb-5 rounded-2xl border border-white/8 bg-[#071614]/50 p-4"><p className="text-sm leading-6 text-[#bdd0c6]">{discovery.description}</p></div>
        {discovery.species && <div className="mb-5 grid gap-2 rounded-2xl border border-[#7de7d4]/15 bg-[#7de7d4]/[.06] p-4 text-xs text-[#c8e5db]"><div className="flex items-center gap-2 font-medium text-[#aef4df]"><BookOpen size={14} /> {discovery.species.name}</div><div><span className="text-[#7faaa0]">Habitat · </span>{discovery.species.habitat}</div><div><span className="text-[#7faaa0]">Nota · </span>{discovery.species.curiosity}</div><div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#7faaa0]">Raridade · {discovery.species.rarity}</div></div>}
        <div className="mb-6 flex flex-wrap gap-2"><span className="rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-[#a8bbb3]">impacto {discovery.impact}</span><span className="rounded-full border border-[#b9ff76]/20 bg-[#b9ff76]/[.08] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-[#b9ff76]">+{discovery.xp} XP</span>{isNew && <span className="rounded-full border border-[#7de7d4]/20 bg-[#7de7d4]/[.08] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-[#7de7d4]"><Sparkles className="mr-1 inline" size={11} /> novo registro</span>}</div>
        {levelUp && <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#b9ff76]/20 bg-[#b9ff76]/[.09] p-3 text-sm text-[#ddffc0]"><ArrowUpRight size={17} /> Você subiu de nível. O olhar está ficando mais afiado.</div>}
        <button onClick={onClose} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b9ff76] px-4 py-3 text-sm font-semibold text-[#0b1717] transition hover:bg-[#d4ffad]">{isNew ? <><Check size={17} /> Guardar no diário</> : "Continuar exploração"}</button>
      </div>
    </div>
  </div>;
}
