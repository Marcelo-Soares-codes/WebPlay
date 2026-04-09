import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Spinner,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack, IoSearch } from "react-icons/io5";
import { TbReload } from "react-icons/tb";

import TicTacToeApi, {
  type IPlayer,
  type ticTacToeRoom,
} from "@/../utils/api/ticTacToeApi";
import { TemplateAuth } from "@/components/TemplateAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Navigate } from "@/lib/router-compat";
import { useNavigate } from "react-router-dom";

const TicTacToeMultiplayer = () => {
  const [rooms, setRooms] = useState<ticTacToeRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const joinRoom = useCallback(
    async (roomId: string) => {
      try {
        const room = await TicTacToeApi.joinRoom({
          roomId,
          playerId: user?.id || "",
        });

        if (!room) {
          showToast("Essa sala nao existe mais.", "error");

          return;
        }

        const isParticipant = room.players.some(
          (player: IPlayer) => player.id === user?.id,
        );

        if (!isParticipant) {
          showToast("Voce nao participa desta sala.", "error");

          return;
        }

        showToast(`Entrou na sala: ${roomId}`, "success");
        navigate(`/tic-tac-toe/multiplayer/${roomId}`);
      } catch {
        showToast("Erro ao entrar na sala", "error");
      }
    },
    [navigate, showToast, user?.id],
  );

  const fetchRooms = useCallback(async () => {
    setLoading(true);

    try {
      const allRooms = await TicTacToeApi.listRooms();
      const availableRooms = allRooms.filter((room) => room.players.length < 2);
      const userRoom = allRooms.find((room) =>
        room.players.some((player: IPlayer) => player.id === user?.id),
      );

      if (userRoom) {
        await joinRoom(userRoom.roomId);
      } else {
        setRooms(availableRooms);
      }
    } catch {
      showToast("Erro ao listar salas", "error");
    } finally {
      setLoading(false);
    }
  }, [joinRoom, showToast, user?.id]);

  const createRoom = useCallback(async () => {
    try {
      const newRoom = await TicTacToeApi.createRoom({
        playerId: user?.id || "",
      });

      setRooms((currentRooms) => [...currentRooms, newRoom]);
      showToast("Sala criada com sucesso!", "success");
      await joinRoom(newRoom.roomId);
    } catch {
      showToast("Erro ao criar a sala", "error");
    }
  }, [joinRoom, showToast, user?.id]);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <TemplateAuth>
      <main className="relative flex flex-col items-center justify-center pt-12 sm:pt-16">
        <Button
          className="absolute left-0 top-0 border-none"
          color="primary"
          startContent={<IoArrowBack />}
          variant="bordered"
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
        <div className="grid w-full grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 lg:grid-cols-4">
          <div>
            <Card>
              <CardBody className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold sm:text-center">
                    Crie uma nova sala
                  </h3>
                  <Button
                    className="w-full font-semibold text-white"
                    color="primary"
                    onClick={createRoom}
                  >
                    Criar sala
                  </Button>
                </div>
                <Divider />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold sm:text-center">
                    Entre via codigo
                  </h3>
                  <Input
                    className="w-full"
                    placeholder="Digite o codigo da sala"
                    value={roomCode}
                    variant="bordered"
                    onChange={(e) => setRoomCode(e.target.value)}
                  />
                  <Button
                    className="w-full font-semibold text-white"
                    color="primary"
                    onClick={() => joinRoom(roomCode)}
                  >
                    Entrar
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
          <Card className="col-span-2 lg:col-span-3">
            <CardBody>
              <div className="flex items-center justify-between">
                <h3 className="mb-2 text-lg font-semibold">
                  Salas disponiveis
                </h3>

                <Button
                  isIconOnly
                  className="border-none"
                  startContent={
                    <motion.div
                      animate={{ rotate: loading ? 360 : 0 }}
                      transition={{
                        duration: 1,
                        repeat: loading ? Infinity : 0,
                        ease: "linear",
                      }}
                    >
                      <TbReload />
                    </motion.div>
                  }
                  variant="bordered"
                  onClick={() => void fetchRooms()}
                />
              </div>
              <Input
                className="mb-2"
                placeholder="Buscar sala"
                startContent={<IoSearch className="text-gray-400" />}
                variant="bordered"
              />
              {loading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <ul className="max-h-[calc(100vh-270px)] w-full overflow-y-auto">
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <li
                        key={room.id}
                        className="flex w-full flex-col items-end justify-between space-y-2 border-b p-2 sm:flex-row sm:items-center sm:space-y-0"
                      >
                        <div className="flex flex-col">
                          <p className="text-sm">
                            <span className="font-semibold">Criador:</span>{" "}
                            <span>{room.players[0]?.name}</span>
                          </p>
                          <p className="pr-2 text-xs text-gray-400">
                            Codigo: {room.roomId}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            className="font-semibold text-white"
                            color="primary"
                            size="sm"
                            onClick={() => void joinRoom(room.roomId)}
                          >
                            Entrar na sala
                          </Button>
                          <div className="flex flex-col items-center text-xs">
                            <span className="font-bold">Players</span>
                            <span className="font-semibold text-primary">
                              {room.players.length}/2
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-gray-400">
                      Nenhuma sala disponivel
                    </p>
                  )}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </main>
    </TemplateAuth>
  );
};

export default TicTacToeMultiplayer;
