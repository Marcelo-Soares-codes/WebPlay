import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";

import { TemplateAuth } from "@/components/TemplateAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Navigate } from "@/lib/router-compat";
import { useNavigate, useParams } from "react-router-dom";

import ticTacToeApi, {
  type TicTacToeRoomState,
} from "../../../../../../utils/api/ticTacToeApi";
import GameBoard from "../../components/Gameboard";

const TicTacToeJoin = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(false);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [showExitPopover, setShowExitPopover] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("X");
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [lastFinishedBoard, setLastFinishedBoard] = useState("");

  const applyRoomState = useCallback(
    (data: TicTacToeRoomState) => {
      if (!data.room || !user) {
        return false;
      }

      const playerIndex = data.room.players.findIndex(
        (player) => player.id === user.id,
      );

      if (playerIndex === -1) {
        showToast("Voce nao participa desta sala.", "error");
        navigate("/tic-tac-toe/multiplayer");

        return false;
      }

      setPlayerSymbol(playerIndex === 0 ? "X" : "O");
      setBoard(data.room.board);
      setCurrentPlayerId(data.room.currentPlayer);
      setIsXNext(data.room.currentPlayer === user.id);

      const finishedBoardKey = data.room.board.join("");

      if (
        (data.winner || data.isDraw) &&
        finishedBoardKey !== lastFinishedBoard
      ) {
        if (data.winner) {
          showToast(`Jogo terminado! Vencedor: ${data.winner}`, "success");

          if (data.winner === "X") {
            setXWins((current) => current + 1);
          } else {
            setOWins((current) => current + 1);
          }
        } else if (data.isDraw) {
          showToast("Jogo terminou em empate!", "warning");
        }

        setLastFinishedBoard(finishedBoardKey);
      }

      if (!data.winner && !data.isDraw && lastFinishedBoard) {
        setLastFinishedBoard("");
      }

      return true;
    },
    [lastFinishedBoard, navigate, showToast, user],
  );

  const handleSquareClick = useCallback(
    async (index: number) => {
      if (board[index] || !user || !roomId || currentPlayerId !== user.id) {
        return;
      }

      try {
        const nextState = await ticTacToeApi.playMove(roomId, index);

        applyRoomState(nextState);
      } catch {
        showToast("Erro ao realizar jogada", "error");
      }
    },
    [applyRoomState, board, currentPlayerId, roomId, showToast, user],
  );

  const zerarPlacar = useCallback(() => {
    setXWins(0);
    setOWins(0);
  }, []);

  const confirmExit = useCallback(async () => {
    setShowExitPopover(false);

    try {
      await ticTacToeApi.leaveRoom({
        roomId: roomId || "",
        playerId: user?.id || "",
      });
    } finally {
      navigate("/tic-tac-toe/multiplayer");
    }
  }, [navigate, roomId, user?.id]);

  useEffect(() => {
    if (!roomId || !user) {
      return;
    }

    let cancelled = false;

    const syncRoom = async () => {
      try {
        const roomState = await ticTacToeApi.getRoom(roomId);

        if (!cancelled) {
          applyRoomState(roomState);
        }
      } catch {
        if (!cancelled) {
          showToast("Erro ao carregar a sala", "error");
          navigate("/tic-tac-toe/multiplayer");
        }
      }
    };

    void syncRoom();

    const interval = window.setInterval(() => {
      void syncRoom();
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [applyRoomState, navigate, roomId, showToast, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <TemplateAuth>
      <main className="relative flex h-[calc(100vh-300px)] flex-col items-center justify-center sm:h-full">
        <Popover
          isOpen={showExitPopover}
          placement="bottom-start"
          onOpenChange={setShowExitPopover}
        >
          <PopoverTrigger>
            <Button
              className="absolute left-0 top-0 border-none"
              color="danger"
              startContent={<IoArrowBack />}
              variant="bordered"
              onClick={() => setShowExitPopover(true)}
            >
              Sair
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-4">
              <p>Tem certeza que deseja sair da sala?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button color="danger" size="sm" onClick={confirmExit}>
                  Confirmar
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  onClick={() => setShowExitPopover(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {roomId && (
          <span className="absolute right-10 top-2 cursor-pointer text-sm">
            <span className="font-semibold">Sala:</span>{" "}
            <span className="text-gray-500">{roomId}</span>
          </span>
        )}
        <h3
          className={`mb-2 text-xl font-semibold ${
            isXNext ? "text-success" : "text-danger"
          }`}
        >
          {currentPlayerId === null
            ? "Aguardando nova partida"
            : isXNext
              ? "Sua vez!"
              : "Vez do oponente"}
        </h3>
        <GameBoard
          board={board}
          oWins={oWins}
          resetGame={() => undefined}
          textInfo={playerSymbol === "X" ? "Voce e X" : "Voce e O"}
          vitoria={undefined}
          xWins={xWins}
          zerarPlacar={zerarPlacar}
          onClick={handleSquareClick}
        />
      </main>
    </TemplateAuth>
  );
};

export default TicTacToeJoin;
