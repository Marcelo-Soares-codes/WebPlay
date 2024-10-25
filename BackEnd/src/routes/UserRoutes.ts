// src/routes/userRoutes.ts
import { Express, Request, Response, NextFunction } from "express";
import UserController from "../controllers/UserController";

const userController = new UserController();

const userRoutes = (app: Express) => {
  app.post("/api/users", (req: Request, res: Response, next: NextFunction) => {
    userController.create(req, res).catch(next);
  });
  app.get("/api/users", (req: Request, res: Response, next: NextFunction) => {
    userController.findAll(req, res).catch(next);
  });
  app.get(
    "/api/users/:id",
    (req: Request, res: Response, next: NextFunction) => {
      userController.findById(req, res).catch(next);
    }
  );
  app.put(
    "/api/users/:id",
    (req: Request, res: Response, next: NextFunction) => {
      userController.update(req, res).catch(next);
    }
  );
  app.delete(
    "/api/users/:id",
    (req: Request, res: Response, next: NextFunction) => {
      userController.delete(req, res).catch(next);
    }
  );
};

export default userRoutes;
