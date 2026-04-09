import api from "./api";

interface CreateRoomData {
  playerId: string;
}

interface JoinRoomData {
  roomId: string;
  playerId: string;
}

interface LeaveRoomData {
  roomId: string;
  playerId: string;
}

export interface IPlayer {
  id: string;
  name: string;
  email: string;
  nickname: string;
  photo?: string | null;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface ticTacToeRoom {
  id: string;
  roomId: string;
  board: Array<string | null>;
  currentPlayer: string | null;
  createdAt: string;
  updatedAt: string;
  players: IPlayer[];
}

export interface TicTacToeRoomState {
  room: ticTacToeRoom | null;
  winner?: string | null;
  isDraw?: boolean;
}

class TicTacToeApi {
  async createRoom(data: CreateRoomData) {
    const response = await api.post("/tictactoe/create", data);

    return response.data as ticTacToeRoom;
  }

  async listRooms() {
    const response = await api.get("/tictactoe/list");

    return response.data as ticTacToeRoom[];
  }

  async joinRoom(data: JoinRoomData) {
    const response = await api.post("/tictactoe/join", data);

    return response.data as ticTacToeRoom | null;
  }

  async leaveRoom(data: LeaveRoomData) {
    await api.post("/tictactoe/leave", data);
  }

  async getRoom(roomId: string) {
    const response = await api.get(`/tictactoe/${roomId}`);

    return response.data as TicTacToeRoomState;
  }

  async playMove(roomId: string, position: number) {
    const response = await api.post("/tictactoe/play", {
      roomId,
      position,
    });

    return response.data as TicTacToeRoomState;
  }
}

const ticTacToeApi = new TicTacToeApi();

export default ticTacToeApi;
