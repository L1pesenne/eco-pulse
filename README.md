# ECO//PULSE

ECO//PULSE é uma experiência de exploração ambiental em uma cidade virtual. O jogador assume o papel de Explorador Ambiental, percorre seis regiões, registra sinais do território, desbloqueia missões adaptativas e conversa com a assistente PULSE.

O projeto foi construído como uma aplicação full-stack funcional: o mapa é interativo e 3D, o progresso é salvo em SQLite, as missões recalculam com base nas ações do jogador e a assistente possui fallback local para funcionar sem chave externa.

## Funcionalidades

- Tela de entrada com animação, identidade visual de natureza + tecnologia e início de uma nova exploração.
- Mapa 3D feito com Three.js e React Three Fiber, com Centro, Parque, Rio, Floresta, Zona Industrial e Bairro Residencial.
- Movimento por seleção de regiões e navegação de câmera por toque/mouse.
- 12 pontos de interesse clicáveis com problemas ambientais, espécies, áreas preservadas e projetos sustentáveis.
- Registro no diário digital com tipo, região, descrição, impacto e XP.
- Sistema de XP com as patentes Observador, Explorador, Guardião, Protetor e Eco-Líder.
- Missões adaptativas que mudam a descrição e o progresso de acordo com o comportamento do jogador.
- Recompensas de XP para missões concluídas.
- Painéis responsivos para mapa, diário, missões e chat PULSE.
- PULSE com respostas locais inteligentes e integração opcional com a API Responses da OpenAI.
- SQLite para salvar perfil, XP, descobertas, missões, visitas e configurações de som.
- Layout mobile com navegação inferior e controles adequados para toque.

## Tecnologias

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Three.js · React Three Fiber · React Three Drei · Node.js · SQLite via `better-sqlite3`.

## Instalação

Requisitos: Node.js 20 ou superior e npm.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Para validar uma build de produção:

```bash
npm run lint
npm run build
npm start
```

O arquivo SQLite é criado automaticamente em `data/eco-pulse.sqlite`. A pasta `data/` é ignorada pelo Git porque contém o estado local do jogador.

## Configuração da IA

Copie `.env.example` para `.env.local` e, opcionalmente, informe:

```env
OPENAI_API_KEY=sua-chave
OPENAI_MODEL=gpt-4o-mini
DATABASE_PATH=./data/eco-pulse.sqlite
```

Sem `OPENAI_API_KEY`, a rota `/api/pulse` usa o guia local embutido. Se a API configurada estiver indisponível, o endpoint também retorna automaticamente para o fallback. Assim, nenhuma chave é necessária para executar o jogo.

## Estrutura

```text
app/
  api/game/route.ts       persistência de exploração
  api/pulse/route.ts      PULSE com IA opcional e fallback
  globals.css             tokens e estilos globais
  page.tsx                entrada da aplicação
components/
  EcoPulseApp.tsx         shell, fluxo de jogo e navegação
  GameMap.tsx             cidade 3D e marcadores
  JournalPanel.tsx        diário e estatísticas
  MissionPanel.tsx        missões adaptativas
  PulseChat.tsx           chat da assistente
  ...                     tela inicial, modal e componentes de UI
lib/
  db.ts                   schema e operações SQLite
  game.ts                 XP, níveis, missões e recompensas
  types.ts                contratos de domínio
  world.ts                regiões e descobertas educativas
```

## Como funciona

1. A aplicação carrega o estado do explorador via `GET /api/game`.
2. Ao selecionar uma região ainda não visitada, o jogador registra território e recebe XP de exploração.
3. Ao clicar em um marcador, o ponto é adicionado ao diário apenas uma vez e sua recompensa é aplicada.
4. A lista de missões é recalculada a partir de descobertas, espécies e regiões visitadas. Ao atingir um objetivo, a recompensa é creditada uma única vez.
5. Cada alteração envia o estado para `POST /api/game`, mantendo a sessão no SQLite.
6. As perguntas do chat são enviadas a `POST /api/pulse`, que usa a IA configurada ou o fallback local.

## Dados educativos

As espécies reais estão identificadas como elementos educativos reais. A “Anta do Vale” é explicitamente marcada como registro ficcional dentro do jogo. Observações ambientais são tratadas como sinais de exploração e não como diagnóstico técnico: alterações de água e poluição devem ser verificadas por órgãos e análises adequadas.

## Futuras melhorias

- Conta multiusuário e sincronização online.
- Editor de missões para escolas e facilitadores.
- Camada de áudio ambiente por região com arquivos licenciados.
- Mais espécies nativas, acessibilidade de alto contraste e modo offline instalável.
- Integração com dados ambientais públicos, sempre exibindo fonte, data e nível de confiança.
