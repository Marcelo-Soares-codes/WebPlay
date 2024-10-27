// src/App.tsx
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/404";
import AllGames from "./pages/AllGames";
import TicTacToe from "./pages/Games/TicTacToe";
import TicTacToeLocal from "./pages/Games/TicTacToe/sections/local";
import TicTacToeAI from "./pages/Games/TicTacToe/sections/TicTacToeAI";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "@/pages/Home/index";

function App() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
        path="/"
      />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />

      <Route
        element={
          <ProtectedRoute>
            <TicTacToe />
          </ProtectedRoute>
        }
        path="/tic-tac-toe"
      />
      <Route
        element={
          <ProtectedRoute>
            <AllGames />
          </ProtectedRoute>
        }
        path="/all-games"
      />
      <Route
        element={
          <ProtectedRoute>
            <TicTacToeLocal />
          </ProtectedRoute>
        }
        path="/tic-tac-toe/local"
      />
      <Route
        element={
          <ProtectedRoute>
            <TicTacToeAI />
          </ProtectedRoute>
        }
        path="/tic-tac-toe/ai"
      />

      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}

export default App;
