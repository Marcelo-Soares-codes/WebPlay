import Image from "next/image";
import Slider from "react-slick";

import { CardGames } from "@/components/CardGames";
import { TemplateAuth } from "@/components/TemplateAuth";
import { useAuth } from "@/contexts/AuthContext";
import { internalGames } from "@/data/games";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const banners = ["/banner1.png", "/banner2.png", "/banner3.png"];

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
      <div className="space-y-2 sm:space-y-4 md:space-y-6">
        <h1 className="text-2xl font-bold md:text-3xl">
          Seja bem-vindo, {user?.name}
        </h1>
        <div>
          <Slider {...settings}>
            {banners.map((banner, index) => (
              <div key={banner} className="px-1">
                <div className="relative h-52 w-full overflow-hidden rounded-md sm:h-96 md:h-72">
                  <Image
                    fill
                    alt={`Banner ${index + 1}`}
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                    src={banner}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="space-y-4 pt-16">
          <h3 className="text-2xl font-bold">Nossos jogos</h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {internalGames.map((game) => (
              <CardGames
                key={game.id}
                description={game.description}
                href={game.href}
                image={game.image}
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
