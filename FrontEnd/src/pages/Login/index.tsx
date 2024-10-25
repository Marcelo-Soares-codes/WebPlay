import { Button, Card, CardBody, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate("/"); // Redireciona para a página principal após o login bem-sucedido
    } catch (err) {
      console.error(err);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Card fullWidth className="max-w-sm">
        <CardBody className="w-full items-center p-6">
          <img
            alt="Logo"
            className="w-32 h-auto object-cover mb-2"
            src="logo.png"
          />
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          <form className="space-y-4 w-full" onSubmit={handleLogin}>
            <Input
              required
              className="w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative w-full">
              <Input
                required
                className="w-full"
                placeholder="Senha"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-2 top-3 text-gray-500"
                type="button"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
            <Button
              fullWidth
              className="text-white"
              color="primary"
              type="submit"
            >
              Entrar
            </Button>
            <div className="w-full flex justify-end items-end ">
              <div className="flex flex-col text-center">
                <span className="text-xs text-gray-500">
                  Não tem uma conta?
                </span>
                <Link
                  className="text-blue-600 text-sm transition-all hover:text-blue-800"
                  to={"/register"}
                >
                  Criar conta
                </Link>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
};

export default Login;
