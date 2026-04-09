import type { NextApiRequest, NextApiResponse } from "next";

import { requireAuthenticatedUserId } from "@/server/auth";
import { leaveRoom } from "@/server/services/tictactoe-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const playerId = requireAuthenticatedUserId(req);

    await leaveRoom(req.body.roomId, playerId);

    return res.status(200).json({ ok: true });
  } catch (error) {
    const status =
      error instanceof Error && error.message === "Token nao fornecido"
        ? 401
        : 500;

    return res.status(status).json({
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    });
  }
}
