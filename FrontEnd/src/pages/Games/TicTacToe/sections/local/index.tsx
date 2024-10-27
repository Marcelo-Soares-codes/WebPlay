import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import GameBoard from "../../components/Gameboard";

import { TemplateAuth } from "@/components/TemplateAuth";

const TicTacToeLocal: React.FC = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isXStarting, setIsXStarting] = useState(true); // Controla quem começa
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [vitoria, setVitoria] = useState<[number, number, number] | undefined>(
    undefined,
  );

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        setVitoria([a, b, c]);

        return squares[a];
      }
    }

    return null;
  };

  useEffect(() => {
    const winner = calculateWinner(board);

    if (winner) {
      if (winner === "X") {
        setXWins((prev) => prev + 1);
      } else {
        setOWins((prev) => prev + 1);
      }
    }
  }, [board, isXNext]);

  const handleClick = (index: number) => {
    if (vitoria || board[index]) return;

    const newBoard = [...board];
    const currentPlayer = isXNext ? "X" : "O";

    // Obtém os índices das peças do jogador atual
    const currentPlayerPositions = newBoard
      .map((value, idx) => (value === currentPlayer ? idx : -1))
      .filter((pos) => pos !== -1);

    if (currentPlayerPositions.length === 3) {
      // Remove a peça mais antiga do jogador atual (primeiro a entrar)
      newBoard[currentPlayerPositions[0]] = null;
    }

    // Coloca a nova peça na posição clicada
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setIsXNext(!isXNext); // Alterna para o próximo jogador
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setVitoria(undefined);
    setIsXStarting(!isXStarting); // Alterna quem começa
    setIsXNext(isXStarting); // Define quem começa o próximo jogo
  };

  const zerarPlacar = () => {
    setXWins(0);
    setOWins(0);
  };

  return (
    <TemplateAuth>
      <main className="relative flex flex-col items-center justify-center h-[65vh] sm:h-full">
        <Button
          className="border-none absolute top-0 left-0"
          color="primary"
          startContent={<IoArrowBack />}
          variant="bordered"
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
        <GameBoard
          board={board}
          isXNext={isXNext}
          oWins={oWins}
          resetGame={resetGame}
          vitoria={vitoria}
          xWins={xWins}
          zerarPlacar={zerarPlacar}
          onClick={handleClick}
        />
      </main>
    </TemplateAuth>
  );
};

export default TicTacToeLocal;
