// src/routes/AuthRoutes.ts
import { Express, Request, Response, NextFunction } from "express";
import AuthController from "../controllers/AuthController";

const authRoutes = (app: Express) => {
  // Função auxiliar para lidar com erros nas rotas assíncronas
  const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    };

  // Rota para registro de usuário
  app.post("/auth/register", asyncHandler(AuthController.register));

  // Rota para login de usuário
  app.post("/auth/login", asyncHandler(AuthController.login));
};

export default authRoutes;
