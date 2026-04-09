import type { NextApiRequest, NextApiResponse } from "next";

import { ValidationError } from "yup";

import { loginUser } from "@/server/services/auth-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const result = await loginUser(req.body);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.errors });
    }

    if (error instanceof Error) {
      const status = error.message === "Credenciais invalidas" ? 401 : 400;

      return res.status(status).json({ message: error.message });
    }

    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
