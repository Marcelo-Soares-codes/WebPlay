import type { NextApiRequest, NextApiResponse } from "next";

import { getBearerToken } from "@/server/auth";
import { validateUserToken } from "@/server/services/auth-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const result = await validateUserToken(token);

    return res.status(200).json(result);
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
