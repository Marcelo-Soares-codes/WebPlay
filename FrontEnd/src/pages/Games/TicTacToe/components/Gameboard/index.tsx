import { Button, Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

type GameBoardProps = {
  board: (string | null)[];
  onClick: (index: number) => void;
  vitoria?: [number, number, number];
  resetGame: () => void;
  zerarPlacar: () => void;
  xWins: number;
  oWins: number;
  isXNext: boolean;
};

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onClick,
  vitoria,
  resetGame,
  zerarPlacar,
  xWins,
  oWins,
  isXNext,
}) => {
  return (
    <div className="flex flex-col items-center">
      <Card className="p-2 flex-row justify-center items-center mb-2 space-x-4">
        <Button
          className="font-semibold text-white"
          color="warning"
          onClick={zerarPlacar}
        >
          Zerar placar
        </Button>
        <div className="flex flex-col justify-center items-center">
          <span className="font-semibold">Vitórias</span>
          <div className="flex space-x-2 justify-center items-center">
            <span className="text-danger">X: {xWins} </span>
            <span className="h-5 w-0.5 bg-zinc-500" />
            <span className="text-primary">O: {oWins}</span>
          </div>
        </div>
        <Button
          className="font-semibold text-white"
          color="primary"
          onClick={resetGame}
        >
          Reiniciar jogo
        </Button>
      </Card>
      <h3 className="text-lg font-bold mb-2">
        Próximo jogador:{" "}
        <span className={isXNext ? "text-danger" : "text-primary"}>
          {isXNext ? "X" : "O"}
        </span>
      </h3>
      <Card className="relative">
        <CardBody className="grid grid-cols-3 gap-2 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-white p-4">
          {board.map((value, index) => (
            <motion.div
              key={index}
              animate={
                vitoria && vitoria.includes(index)
                  ? { scale: [1, 1.05, 1], rotate: [0, 7, 0] }
                  : { scale: 1, rotate: 0 }
              }
              className="w-full h-full"
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            >
              <Button
                className={`w-full h-full flex justify-center items-center text-4xl font-bold !min-h-0 ${
                  vitoria && vitoria.includes(index)
                    ? "border-4 border-yellow-500"
                    : ""
                }`}
                color={
                  value === "X"
                    ? "danger"
                    : value === "O"
                      ? "primary"
                      : "default"
                }
                disableRipple={false}
                style={{ lineHeight: "1" }}
                variant="bordered"
                onClick={() => onClick(index)}
              >
                {value || <span>&nbsp;</span>}
              </Button>
            </motion.div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default GameBoard;
