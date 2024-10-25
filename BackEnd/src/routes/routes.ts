import { Express } from "express-serve-static-core";
import authRoutes from "./AuthRoutes";

const routes = (app: Express) => {
  authRoutes(app);
};

export default routes;

