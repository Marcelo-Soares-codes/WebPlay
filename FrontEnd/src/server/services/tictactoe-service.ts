import { Types } from "mongoose";

import { connectToDatabase } from "../lib/mongoose";
import { TicTacToeRoomModel } from "../models/TicTacToeRoom";

const INACTIVE_ROOM_MS = 5 * 60 * 1000;

type DatabasePlayer = {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  nickname: string;
  photo?: string | null;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};

type DatabaseRoom = {
  _id: Types.ObjectId | string;
  roomId: string;
  board?: Array<string | null>;
  currentPlayer: string | null;
  players: DatabasePlayer[];
  createdAt: Date;
  updatedAt: Date;
};

function generateRoomId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

async function cleanupInactiveRooms() {
  const olderThan = new Date(Date.now() - INACTIVE_ROOM_MS);

  await TicTacToeRoomModel.deleteMany({
    updatedAt: {
      $lt: olderThan,
    },
  });
}

async function findRoomByRoomId(roomId: string) {
  return TicTacToeRoomModel.findOne({ roomId }).populate("players").lean();
}

function normalizeRoom(room: DatabaseRoom) {
  return {
    id: room._id.toString(),
    roomId: room.roomId,
    board: Array.isArray(room.board)
      ? room.board.map((value) => value ?? null)
      : Array(9).fill(null),
    currentPlayer: room.currentPlayer,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    players: room.players.map((player) => ({
      id: player._id.toString(),
      name: player.name,
      email: player.email,
      nickname: player.nickname,
      photo: player.photo ?? null,
      score: player.score,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    })),
  };
}

function isDuplicateKeyError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "number" &&
    error.code === 11000
  );
}

function checkWinner(board: Array<string | null>) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function buildRoomState(room: DatabaseRoom) {
  const normalizedRoom = normalizeRoom(room);
  const winner = checkWinner(normalizedRoom.board);
  const isDraw =
    !winner && normalizedRoom.board.every((value) => value !== null);

  return {
    room: normalizedRoom,
    winner,
    isDraw,
  };
}

export async function createRoom(playerId: string) {
  await connectToDatabase();
  await cleanupInactiveRooms();

  let roomId = generateRoomId();

  while (true) {
    try {
      const room = await TicTacToeRoomModel.create({
        roomId,
        board: Array(9).fill(null),
        currentPlayer: playerId,
        players: [new Types.ObjectId(playerId)],
      });

      const populatedRoom = await room.populate("players");

      return normalizeRoom(populatedRoom.toObject() as unknown as DatabaseRoom);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        roomId = generateRoomId();
        continue;
      }

      throw error;
    }
  }
}

export async function listRooms() {
  await connectToDatabase();
  await cleanupInactiveRooms();

  const rooms = await TicTacToeRoomModel.find()
    .sort({ createdAt: -1 })
    .populate("players")
    .lean();

  return rooms.map((room) => normalizeRoom(room as unknown as DatabaseRoom));
}

export async function joinRoom(roomId: string, playerId: string) {
  await connectToDatabase();
  await cleanupInactiveRooms();

  const room = await findRoomByRoomId(roomId);

  if (!room) {
    return null;
  }

  const normalizedRoom = normalizeRoom(room as unknown as DatabaseRoom);
  const alreadyJoined = normalizedRoom.players.some(
    (player) => player.id === playerId,
  );

  if (!alreadyJoined && normalizedRoom.players.length >= 2) {
    return null;
  }

  if (!alreadyJoined) {
    await TicTacToeRoomModel.updateOne(
      { roomId },
      {
        $addToSet: {
          players: new Types.ObjectId(playerId),
        },
      },
    );
  }

  const updatedRoom = await findRoomByRoomId(roomId);

  return updatedRoom
    ? normalizeRoom(updatedRoom as unknown as DatabaseRoom)
    : null;
}

export async function getRoom(roomId: string) {
  await connectToDatabase();

  const room = await findRoomByRoomId(roomId);

  return room ? normalizeRoom(room as unknown as DatabaseRoom) : null;
}

export async function getRoomState(roomId: string) {
  await connectToDatabase();

  const room = await findRoomByRoomId(roomId);

  return room ? buildRoomState(room as unknown as DatabaseRoom) : null;
}

export async function leaveRoom(roomId: string, playerId: string) {
  await connectToDatabase();

  const room = await findRoomByRoomId(roomId);

  if (!room) {
    throw new Error("Sala nao encontrada");
  }

  const normalizedRoom = normalizeRoom(room as unknown as DatabaseRoom);
  const remainingPlayers = normalizedRoom.players.filter(
    (player) => player.id !== playerId,
  );

  await TicTacToeRoomModel.updateOne(
    { roomId },
    {
      $pull: {
        players: new Types.ObjectId(playerId),
      },
      $set: {
        currentPlayer:
          normalizedRoom.currentPlayer === playerId
            ? (remainingPlayers[0]?.id ?? null)
            : normalizedRoom.currentPlayer,
      },
    },
  );

  const updatedRoom = await findRoomByRoomId(roomId);

  if (!updatedRoom || updatedRoom.players.length === 0) {
    await TicTacToeRoomModel.deleteOne({ roomId });

    return null;
  }

  return normalizeRoom(updatedRoom as unknown as DatabaseRoom);
}

export async function playMove(
  roomId: string,
  playerId: string,
  position: number,
) {
  await connectToDatabase();

  const room = await findRoomByRoomId(roomId);

  if (!room) {
    throw new Error("Sala nao encontrada");
  }

  const normalizedRoom = normalizeRoom(room as unknown as DatabaseRoom);

  if (normalizedRoom.currentPlayer !== playerId) {
    throw new Error("Nao e a vez do jogador");
  }

  if (normalizedRoom.board[position] !== null) {
    throw new Error("Posicao ja ocupada");
  }

  const playerIndex = normalizedRoom.players.findIndex(
    (player) => player.id === playerId,
  );

  if (playerIndex === -1) {
    throw new Error("Voce nao participa desta sala.");
  }

  const board = [...normalizedRoom.board];

  board[position] = playerIndex === 0 ? "X" : "O";

  const winner = checkWinner(board);
  const isDraw = !winner && board.every((value) => value !== null);
  const nextPlayer =
    normalizedRoom.players.find((player) => player.id !== playerId)?.id ?? null;

  await TicTacToeRoomModel.updateOne(
    { roomId },
    {
      $set: {
        board,
        currentPlayer: winner || isDraw ? null : nextPlayer,
      },
    },
  );

  const updatedRoom = await findRoomByRoomId(roomId);

  return updatedRoom
    ? buildRoomState(updatedRoom as unknown as DatabaseRoom)
    : { room: null, winner, isDraw };
}
