import type { NextApiRequest, NextApiResponse } from "next";

import { listRooms } from "@/server/services/tictactoe-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const rooms = await listRooms();

    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    });
  }
}
