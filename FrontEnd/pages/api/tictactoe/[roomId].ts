import type { NextApiRequest, NextApiResponse } from "next";

import { getRoomState } from "@/server/services/tictactoe-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const roomId = req.query.roomId;

  if (typeof roomId !== "string" || !roomId.trim()) {
    return res.status(400).json({ message: "Codigo da sala invalido" });
  }

  try {
    const state = await getRoomState(roomId);

    if (!state) {
      return res.status(404).json({ message: "Sala nao encontrada" });
    }

    return res.status(200).json(state);
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    });
  }
}
