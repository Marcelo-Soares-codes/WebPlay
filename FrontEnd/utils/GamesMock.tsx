interface GameInterface {
  img: string;
  title: string;
  description: string;
  link: string;
  status?: "normal" | "hot" | "coming-soon" | "disabled";
}

export const GamesMock: GameInterface[] = [
  {
    img: "./tik-tac-toe.png",
    title: "jogo da velha",
    description:
      "Conheca o jogo da velha de uma forma diferente da tradicional, divirta-se com o novo tic-tac-toe!",
    link: "/tic-tac-toe",
    status: "hot",
  },
  {
    img: "./dama.png",
    title: "Jogo da Dama",
    description: "Jogue um dos jogos clássicos da Dama e divirta-se!",
    link: "",
    status: "coming-soon",
  },
];
