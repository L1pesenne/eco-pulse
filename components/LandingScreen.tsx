"use client";

import { ArrowRight, Compass, Leaf, Radio, Sparkles } from "lucide-react";

export function LandingScreen({ onStart, busy }: { onStart: () => void; busy?: boolean }) {
  return <main className="relative min-h-screen overflow-hidden bg-[#081413] text-[#e9f8ed]">
    <div className="absolute inset-0 grid-noise opacity-70" />
    <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#79d89b]/10 blur-[110px]" />
    <div className="absolute bottom-[-130px] right-[-80px] h-[28rem] w-[28rem] rounded-full bg-[#b9ff76]/10 blur-[130px]" />
    <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-10 lg:px-14">
      <header className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl border border-[#b9ff76]/35 bg-[#b9ff76]/10 text-[#b9ff76]"><Radio size={17} /></div><span className="text-sm font-semibold tracking-[0.23em]">ECO<span className="text-[#b9ff76]">//</span>PULSE</span></div><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#75928a]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b9ff76]" /> sistema online</div></header>
      <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.08fr_.92fr] lg:py-8">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b9ff76]/20 bg-[#b9ff76]/[.07] px-3 py-1.5 text-[10px] uppercase tracking-[0.21em] text-[#b9ff76]"><Sparkles size={12} /> protocolo de exploração · 01</div>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.03] tracking-[-0.07em] text-[#f1ffe9] sm:text-7xl">A cidade fala.<br /><span className="text-[#b9ff76]">Você escuta.</span></h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-[#9db5aa] sm:text-lg">Entre em uma cidade viva, encontre os sinais que quase passam despercebidos e transforme observação em ação.</p>
          <button disabled={busy} onClick={onStart} className="group mt-10 inline-flex items-center gap-4 rounded-xl bg-[#b9ff76] px-5 py-3.5 text-sm font-semibold text-[#0b1717] shadow-glow transition hover:bg-[#d7ffb5] disabled:cursor-wait disabled:opacity-70">{busy ? "Preparando mapa..." : "Iniciar exploração"}<span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0b1717]/10 transition group-hover:translate-x-1"><ArrowRight size={16} /></span></button>
          <div className="mt-14 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-5"><div><div className="text-lg font-semibold text-[#e8f8e8]">06</div><div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#718e83]">regiões</div></div><div><div className="text-lg font-semibold text-[#e8f8e8]">12</div><div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#718e83]">sinais vivos</div></div><div><div className="text-lg font-semibold text-[#e8f8e8]">∞</div><div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#718e83]">possibilidades</div></div></div>
        </div>
        <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
          <div className="absolute inset-8 rounded-full border border-[#b9ff76]/10" /><div className="absolute inset-20 rounded-full border border-dashed border-[#7de7d4]/15" />
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#102a27]/70 p-5 shadow-2xl backdrop-blur-sm sm:p-8">
            <div className="absolute inset-0 grid-noise opacity-60" />
            <div className="absolute left-8 top-8 text-[9px] uppercase tracking-[0.25em] text-[#66877c]">cidade / pulso ambiental</div>
            <div className="absolute inset-[17%] rotate-[-7deg] rounded-[40%] border border-[#83c699]/25 bg-[#70af80]/[.08]" />
            <div className="absolute left-[17%] top-[48%] h-[18%] w-[66%] rotate-[22deg] rounded-full bg-[#63c9c3]/20 blur-[2px]" />
            <div className="absolute left-[41%] top-[36%] h-20 w-24 rounded-[45%] border border-[#b9ff76]/50 bg-[#b9ff76]/[.1] shadow-glow" />
            <div className="absolute left-[46%] top-[42%] grid h-10 w-10 place-items-center rounded-full border border-[#d8ffb0] bg-[#b9ff76] text-[#122318] shadow-glow"><Compass size={19} /></div>
            {[['left-[22%] top-[28%]', 'bg-[#7de7d4]'], ['left-[71%] top-[26%]', 'bg-[#ef9569]'], ['left-[27%] top-[72%]', 'bg-[#b3a7ed]'], ['left-[74%] top-[68%]', 'bg-[#b9ff76]']].map(([position, color], index) => <div key={index} className={`absolute ${position} grid h-5 w-5 place-items-center rounded-full border border-white/50 ${color} shadow-lg`}><span className="h-1.5 w-1.5 rounded-full bg-[#0b1717]" /></div>)}
            <div className="absolute bottom-7 left-7 rounded-xl border border-white/10 bg-[#081514]/75 px-3 py-2 backdrop-blur-md"><div className="flex items-center gap-2 text-[10px] text-[#cce7d4]"><Leaf size={13} className="text-[#b9ff76]" /> leitura em andamento</div><div className="mt-1 font-mono text-[9px] text-[#688a7e]">-34.6037 / -58.3816 · agora</div></div>
          </div>
        </div>
      </section>
      <footer className="flex flex-col gap-3 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.16em] text-[#607e73] sm:flex-row sm:items-center sm:justify-between"><span>uma experiência de exploração ambiental</span><span>powered by observação · comunidade · PULSE</span></footer>
    </div>
  </main>;
}
