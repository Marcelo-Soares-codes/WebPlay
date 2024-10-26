// src/App.tsx
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/404";
import TicTacToe from "./pages/Games/TicTacToe";
import TicTacToeLocal from "./pages/Games/TicTacToe/sections/local";
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

      <Route element={<TicTacToe />} path="/tic-tac-toe" />
      <Route element={<TicTacToeLocal />} path="/tic-tac-toe/local" />

      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}

export default App;
