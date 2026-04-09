import type { NextApiRequest } from "next";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export function signToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET as string, {
    expiresIn: "8h",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET as string) as { id: string };
}

export function getBearerToken(authorization?: string) {
  if (!authorization) {
    return null;
  }

  const [, token] = authorization.split(" ");

  return token || null;
}

export function requireAuthenticatedUserId(req: NextApiRequest) {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    throw new Error("Token nao fornecido");
  }

  const decoded = verifyToken(token);

  return decoded.id;
}
