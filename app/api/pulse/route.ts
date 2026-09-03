import { NextResponse } from "next/server";
import type { ApiChatMessage, GameState, PulseResponse } from "@/lib/types";

export const runtime = "nodejs";

function localPulse(message: string, state?: GameState): PulseResponse {
  const normalized = message.toLowerCase();
  const discoveries = state?.discoveries ?? [];
  const region = discoveries.at(-1)?.region;
  const hasRiverIssue = discoveries.some((item) => item.region === "river" && ["waste", "water"].includes(item.kind));
  let response = "Posso ajudar a interpretar sinais ambientais, revisar suas descobertas e sugerir o próximo passo da exploração.";
  let suggestions = ["O que devo observar no Rio?", "Como funciona o XP?", "Qual é a próxima missão?"];

  if (normalized.includes("rio") || normalized.includes("água") || normalized.includes("agua")) {
    response = hasRiverIssue
      ? "O Rio já tem sinais registrados no seu diário. Observe conexões: resíduos na margem podem ser transportados pela chuva, enquanto alterações de cor precisam de investigação técnica — uma observação não substitui análise laboratorial."
      : "No Rio, procure mudanças visuais, resíduos nas margens e pontos onde a água encontra a cidade. Registre contexto e localização; evidência boa é específica e cuidadosa.";
    suggestions = ["Criar uma missão para o Rio", "Como registrar uma evidência?", "Por que a água muda de cor?"];
  } else if (normalized.includes("floresta") || normalized.includes("espécie") || normalized.includes("especie") || normalized.includes("animal")) {
    response = "Na Floresta, caminhe devagar e procure sinais indiretos: rastros, sons, ninhos e mudanças na cobertura vegetal. Não toque nem alimente animais. A biodiversidade ganha força quando habitats permanecem conectados.";
    suggestions = ["Onde encontro espécies?", "O que é um corredor verde?", "Ver meu caderno de biodiversidade"];
  } else if (normalized.includes("xp") || normalized.includes("nível") || normalized.includes("nivel") || normalized.includes("ponto")) {
    response = `Você está no nível ${state?.profile.level ?? 1} e tem ${state?.profile.xp ?? 0} XP. Cada descoberta tem uma recompensa própria; variar regiões e observar espécies também acelera sua leitura sistêmica da cidade.`;
    suggestions = ["Qual é minha próxima meta?", "Mostrar estatísticas", "Explorar outra região"];
  } else if (normalized.includes("missão") || normalized.includes("missao")) {
    const next = state?.missions.find((item) => !item.completed);
    response = next ? `Sua missão mais próxima é “${next.title}”: ${next.objective}. Você está em ${next.progress}/${next.target}.` : "Todas as missões atuais foram concluídas. Continue explorando para desbloquear novos sinais.";
    suggestions = ["Como concluir esta missão?", "Onde estão os pontos críticos?", "Analisar meu progresso"];
  } else if (normalized.includes("olá") || normalized.includes("ola") || normalized.includes("oi")) {
    response = `Olá, ${state?.profile.name ?? "Explorador"}. A cidade está em escuta. O que você quer investigar hoje${region ? `? Seu último sinal veio de ${region}` : ""}?`;
  }

  return { message: response, suggestions, source: "local" };
}

async function aiPulse(messages: ApiChatMessage[], state?: GameState): Promise<PulseResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const context = `Explorador nível ${state?.profile.level ?? 1}, XP ${state?.profile.xp ?? 0}. Descobertas: ${state?.discoveries.length ?? 0}. Regiões visitadas: ${state?.visitedRegions.length ?? 0}.`;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: `Você é PULSE, uma guia ambiental acolhedora dentro do jogo ECO//PULSE. Responda em português brasileiro, com clareza e sem inventar fatos científicos. Quando algo precisar de validação técnica, diga isso. Contexto: ${context}` },
        ...messages.slice(-8).map((item) => ({ role: item.role, content: item.content }))
      ],
      max_output_tokens: 300
    }),
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) return null;
  const payload = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  const outputText = payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text" || item.text)?.text;
  if (!outputText) return null;
  return { message: outputText, suggestions: ["O que observar agora?", "Atualizar meu plano", "Explicar esta descoberta"], source: "ai" };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { messages?: ApiChatMessage[]; state?: GameState };
    const messages = body.messages ?? [];
    if (!messages.length) return NextResponse.json({ error: "Envie uma mensagem para PULSE." }, { status: 400 });
    const answer = await aiPulse(messages, body.state).catch(() => null);
    return NextResponse.json(answer ?? localPulse(messages.at(-1)?.content ?? "", body.state));
  } catch (error) {
    console.error("Pulse error", error);
    return NextResponse.json(localPulse("olá"));
  }
}
