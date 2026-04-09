import { CardGames } from "@/components/CardGames";
import { TemplateAuth } from "@/components/TemplateAuth";
import { internalGames } from "@/data/games";

const AllGames = () => {
  return (
    <TemplateAuth>
      <main className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Todos os jogos</h1>
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
      </main>
    </TemplateAuth>
  );
};

export default AllGames;
