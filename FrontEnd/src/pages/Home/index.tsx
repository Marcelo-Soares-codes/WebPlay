import Slider from "react-slick";

import { CardGames } from "@/components/CardGames";
import { TemplateAuth } from "@/components/TemplateAuth";
import { useAuth } from "@/contexts/AuthContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface GameInterface {
  img: string;
  title: string;
  description: string;
  link: string;
  status?: "normal" | "hot" | "coming-soon" | "disabled";
}

const banners = ["./banner1.png", "./banner2.png", "./banner3.png"];
const games: GameInterface[] = [
  {
    img: "./tik-tac-toe.png",
    title: "jogo da velha",
    description:
      "Conheca o jogo da velha de uma forma diferente da tradicional, divirta-se com o novo tic-tac-toe!",
    link: "https://example.com/game2",
    status: "hot",
  },
  {
    img: "./dama.png",
    title: "Jogo da Dama",
    description: "Jogue um dos jogos clássicos da Dama e divirta-se!",
    link: "https://example.com/game1",
    status: "coming-soon",
  },
];

const Home = () => {
  const { user } = useAuth();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <TemplateAuth>
      <div className="space-y-6">
        <h1 className="font-bold text-3xl">Seja bem-vindo, {user?.name}</h1>
        <div>
          <Slider {...settings}>
            {banners.map((banner, index) => (
              <div key={index} className="px-1">
                <img
                  alt={`Banner ${index + 1}`}
                  className="w-full h-96 object-cover rounded-md"
                  src={banner}
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="pt-16 space-y-4">
          <h3 className="text-2xl font-bold">Nosso jogos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <CardGames
                key={index}
                description={game.description}
                img={game.img}
                link={game.link}
                status={game.status}
                title={game.title}
              />
            ))}
          </div>
        </div>
      </div>
    </TemplateAuth>
  );
};

export default Home;
