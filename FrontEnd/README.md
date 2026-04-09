# WebPlay

Hub de jogos interno construído com Next.js.

## Objetivo

Esta base foi consolidada para servir como ponto de partida sólido para:

- jogos internos desenvolvidos dentro do próprio projeto
- autenticação e persistência no mesmo app Next
- expansão futura para novos jogos sem dependência de backend separado
- evolução posterior para jogos embedados, sem travar a arquitetura atual

## Stack

- Next.js 14
- React 18
- TypeScript
- NextUI
- Tailwind CSS
- Socket.IO
- MongoDB com Mongoose

## Estrutura

- `pages/`: rotas públicas, páginas de jogo e rotas de API do Next
- `src/components/`: UI compartilhada
- `src/contexts/`: autenticação, toast e socket
- `src/data/`: catálogo interno de jogos do hub
- `src/server/`: serviços, modelos e autenticação do lado servidor
- `utils/api/`: clientes HTTP usados pelo front

## Ambiente

Crie um `.env` a partir de `.env.example`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/webplay
JWT_SECRET=change-me
```

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Estado atual

- backend separado removido
- base unificada em Next
- lint limpo
- estrutura pronta para adicionar novos jogos internos
