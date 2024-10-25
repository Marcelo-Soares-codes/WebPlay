import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes";

dotenv.config();

const app = express();

// Middleware para habilitar o CORS
app.use(cors());

// Middleware para permitir o uso de JSON
app.use(express.json());

// Adicionando suas rotas
routes(app);

// Iniciando o servidor na porta fornecida pelo ambiente
const PORT = process.env.PORT || 3000; // Use a porta fornecida pelo ambiente, ou a porta 3000 se não definida
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
