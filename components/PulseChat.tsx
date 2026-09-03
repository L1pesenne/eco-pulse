"use client";

import { Bot, ChevronRight, LoaderCircle, Send, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";
import type { ApiChatMessage, GameState } from "@/lib/types";

const welcome: ApiChatMessage = { role: "assistant", content: "Olá, Explorador. Sou PULSE — sua camada de leitura ambiental. Quer investigar uma região, entender uma descoberta ou revisar seu próximo passo?" };

export function PulseChat({ state, compact = false }: { state: GameState; compact?: boolean }) {
  const [messages, setMessages] = useState<ApiChatMessage[]>([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(["O que observar no Rio?", "Como avanço de nível?", "Qual é a próxima missão?"]);

  async function sendMessage(content = input) {
    const clean = content.trim();
    if (!clean || loading) return;
    const next = [...messages, { role: "user" as const, content: clean }];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const response = await fetch("/api/pulse", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, state }) });
      const payload = await response.json() as { message?: string; suggestions?: string[] };
      setMessages((current) => [...current, { role: "assistant", content: payload.message ?? "Não consegui interpretar esse sinal agora." }]);
      if (payload.suggestions?.length) setSuggestions(payload.suggestions);
    } catch { setMessages((current) => [...current, { role: "assistant", content: "A conexão oscilou, mas o diário continua seguro. Tente novamente em alguns segundos." }]); }
    finally { setLoading(false); }
  }

  return <div className={`flex h-full min-h-0 flex-col ${compact ? "" : "rounded-2xl"}`}>
    <div className="mb-4 flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl border border-[#7de7d4]/20 bg-[#7de7d4]/10 text-[#7de7d4]"><Bot size={18} /></div><div><div className="text-sm font-semibold text-[#eaffef]">PULSE</div><div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] text-[#78978b]"><span className="h-1.5 w-1.5 rounded-full bg-[#b9ff76]" /> guia adaptativa</div></div></div>
    <div className="thin-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
      {messages.map((message, index) => <div key={`${index}-${message.role}`} className={`flex gap-2.5 ${message.role === "user" ? "flex-row-reverse" : ""}`}><div className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-lg ${message.role === "user" ? "bg-white/10 text-[#b7c9c0]" : "bg-[#7de7d4]/10 text-[#7de7d4]"}`}>{message.role === "user" ? <UserRound size={12} /> : <Sparkles size={12} />}</div><div className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-xs leading-5 ${message.role === "user" ? "rounded-tr-sm bg-white/[.08] text-[#d7e5dd]" : "rounded-tl-sm border border-white/8 bg-[#071614]/55 text-[#b7ccc1]"}`}>{message.content}</div></div>)}
      {loading && <div className="flex items-center gap-2 px-2 text-[11px] text-[#76988b]"><LoaderCircle size={13} className="animate-spin" /> PULSE está lendo os sinais...</div>}
    </div>
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{suggestions.slice(0, compact ? 2 : 3).map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)} className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[.04] px-2.5 py-1.5 text-[10px] text-[#94b1a5] transition hover:border-[#7de7d4]/30 hover:text-[#bff9e9]">{suggestion}<ChevronRight size={11} /></button>)}</div>
    <form onSubmit={(event) => { event.preventDefault(); void sendMessage(); }} className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-[#071513]/70 p-1.5 focus-within:border-[#7de7d4]/35"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Pergunte à PULSE..." className="min-w-0 flex-1 bg-transparent px-2 text-xs text-[#e7f8ed] outline-none placeholder:text-[#58766d]" /><button disabled={!input.trim() || loading} aria-label="Enviar mensagem" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#7de7d4] text-[#0b1717] transition hover:bg-[#b4f8e9] disabled:cursor-not-allowed disabled:opacity-30"><Send size={14} /></button></form>
  </div>;
}
