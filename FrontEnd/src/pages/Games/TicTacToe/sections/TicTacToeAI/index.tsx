import { Button } from "@nextui-org/button";
import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

import GameBoard from "../../components/Gameboard";

import { TemplateAuth } from "@/components/TemplateAuth";

type Player = "X" | "O" | null;

const checkWinner = (
  board: Player[],
): [Player, [number, number, number]] | undefined => {
  const lines: [number, number, number][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [board[a], [a, b, c]];
    }
  }

  return undefined;
};

const getAIMove = (
  board: Player[],
  difficulty: string,
  positions: number[],
): number => {
  switch (difficulty) {
    case "easy":
      return getEasyMove(board);
    case "medium":
      return getMediumMove(board);
    case "hard":
      return getHardMove(board, positions);
    default:
      return getRandomMove(board);
  }
};

const getEasyMove = (board: Player[]): number => {
  // Chance de 50% de bloquear o oponente se ele estiver prestes a vencer
  if (Math.random() < 0.5) {
    const blockMove = findWinningMove(board, "X");

    if (blockMove !== null) return blockMove;
  }

  return getRandomMove(board);
};

const getRandomMove = (board: Player[]): number => {
  const availableMoves = board
    .map((val, idx) => (val === null ? idx : null))
    .filter((val) => val !== null) as number[];

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const findWinningMove = (board: Player[], player: Player): number | null => {
  const lines: [number, number, number][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    const values = [board[a], board[b], board[c]];

    if (
      values.filter((val) => val === player).length === 2 &&
      values.includes(null)
    ) {
      return line[values.indexOf(null)];
    }
  }

  return null;
};

const getMediumMove = (board: Player[]): number => {
  const winMove = findWinningMove(board, "O");

  if (winMove !== null) return winMove;

  const blockMove = findWinningMove(board, "X");

  if (blockMove !== null) return blockMove;

  return getRandomMove(board);
};

const getHardMove = (
  board: Player[],
  positions: number[],
  history: Set<number> = new Set(),
): number => {
  const scores: { [key: string]: number } = { O: 100, X: -100, Tie: 0 };
  const MAX_DEPTH = 2;

  const minimaxWithRemoval = (
    board: Player[],
    depth: number,
    isMaximizing: boolean,
    currentPositions: number[],
  ): number => {
    const result = checkWinner(board);

    if (result) {
      const [player] = result;

      return player ? scores[player] : 0;
    }
    if (!board.includes(null) || depth >= MAX_DEPTH) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;
    const player = isMaximizing ? "O" : "X";

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const simulatedBoard = [...board];
        const updatedPositions = [...currentPositions];

        let removedPosition: number | null = null;

        if (updatedPositions.length === 3) {
          removedPosition = updatedPositions.shift() as number;
          simulatedBoard[removedPosition] = null;
        }

        simulatedBoard[i] = player;
        updatedPositions.push(i);

        let score = minimaxWithRemoval(
          simulatedBoard,
          depth + 1,
          !isMaximizing,
          updatedPositions,
        );

        score += Math.random() * 0.1;
        if (history.has(i)) score -= 0.5;

        bestScore = isMaximizing
          ? Math.max(score, bestScore)
          : Math.min(score, bestScore);

        if (removedPosition !== null) {
          simulatedBoard[removedPosition] = player;
        }
      }
    }

    return bestScore;
  };

  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      const simulatedBoard = [...board];
      const updatedPositions = [...positions];

      let removedPosition: number | null = null;

      if (updatedPositions.length === 3) {
        removedPosition = updatedPositions.shift() as number;
        simulatedBoard[removedPosition] = null;
      }

      simulatedBoard[i] = "O";
      updatedPositions.push(i);

      let score = minimaxWithRemoval(
        simulatedBoard,
        0,
        false,
        updatedPositions,
      );

      if (history.has(i)) score -= 0.5;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }

      if (removedPosition !== null) {
        simulatedBoard[removedPosition] = "O";
      }
    }
  }

  history.add(bestMove);

  return bestMove;
};

const TicTacToeAI: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const difficulty = queryParams.get("difficulty") || "easy";

  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [xPositions, setXPositions] = useState<number[]>([]);
  const [oPositions, setOPositions] = useState<number[]>([]);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [vitoria, setVitoria] = useState<[number, number, number] | undefined>(
    undefined,
  );
  const [winner, setWinner] = useState<Player | undefined>(undefined);
  const [startingPlayer, setStartingPlayer] = useState<Player>("X");

  const updateBoard = (
    newBoard: Player[],
    player: Player,
    index: number,
    positions: number[],
    setPositions: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    if (positions.length === 3) {
      const firstPosition = positions[0];

      newBoard[firstPosition] = null;
      setPositions((prev) => [...prev.slice(1), index]);
    } else {
      setPositions((prev) => [...prev, index]);
    }
    newBoard[index] = player;
  };

  const handlePlayerMove = (index: number) => {
    if (board[index] || vitoria || !isXNext) return;
    const newBoard = [...board];

    updateBoard(newBoard, "X", index, xPositions, setXPositions);
    setBoard(newBoard);
    setIsXNext(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXPositions([]);
    setOPositions([]);
    setVitoria(undefined);
    setWinner(undefined);
    setStartingPlayer((prev) => (prev === "X" ? "O" : "X"));
    setIsXNext(startingPlayer === "X");
  };

  const zerarPlacar = () => {
    setXWins(0);
    setOWins(0);
  };

  useEffect(() => {
    const result = checkWinner(board);

    if (result && !winner) {
      const [player, line] = result;

      setVitoria(line);
      setWinner(player);

      if (player === "X") setXWins((prev) => prev + 1);
      else setOWins((prev) => prev + 1);

      return;
    }

    if (!isXNext && !vitoria && !winner) {
      const aiMove = getAIMove(board, difficulty, oPositions);

      if (aiMove !== -1) {
        const newBoard = [...board];

        updateBoard(newBoard, "O", aiMove, oPositions, setOPositions);
        setTimeout(() => {
          setBoard(newBoard);
          setIsXNext(true);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, isXNext, difficulty, vitoria, winner]);

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
        <h1 className="text-2xl mb-4 font-semibold">
          Nível {difficulty} contra a IA🤖
        </h1>
        <GameBoard
          board={board}
          isXNext={isXNext}
          oWins={oWins}
          resetGame={resetGame}
          vitoria={vitoria}
          xWins={xWins}
          zerarPlacar={zerarPlacar}
          onClick={handlePlayerMove}
        />
      </main>
    </TemplateAuth>
  );
};

export default TicTacToeAI;
