export type GameStatus = "normal" | "hot" | "coming-soon" | "disabled";

export interface GameEntry {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  href: string;
  status: GameStatus;
}

export const internalGames: GameEntry[] = [
  {
    id: "tic-tac-toe",
    slug: "tic-tac-toe",
    title: "Jogo da Velha",
    description:
      "Modo local, contra IA e multiplayer em uma base pronta para evoluir com novos jogos.",
    image: "/tik-tac-toe.png",
    href: "/tic-tac-toe",
    status: "hot",
  },
  {
    id: "checkers",
    slug: "checkers",
    title: "Damas",
    description:
      "Proximo jogo interno do hub. A estrutura ja esta pronta para integrar novos modulos.",
    image: "/dama.png",
    href: "/all-games",
    status: "coming-soon",
  },
];
