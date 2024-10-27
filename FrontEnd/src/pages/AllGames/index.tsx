import { GamesMock } from "../../../utils/GamesMock";

import { CardGames } from "@/components/CardGames";
import { TemplateAuth } from "@/components/TemplateAuth";

const AllGames = () => {
  return (
    <TemplateAuth>
      <main className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Todos os jogos</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GamesMock.map((game, index) => (
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
      </main>
    </TemplateAuth>
  );
};

export default AllGames;
