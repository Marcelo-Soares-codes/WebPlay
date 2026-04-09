import type React from "react";

import { Button, Card, CardBody, Input } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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
      navigate("/");
    } catch {}
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <Card fullWidth className="max-w-sm">
        <CardBody className="w-full items-center p-6">
          <Image
            alt="Logo WebPlay"
            className="mb-2 h-auto w-32 object-cover"
            height={96}
            src="/logo.png"
            width={128}
          />
          <h2 className="mb-6 text-center text-3xl font-bold">Login</h2>
          <form className="w-full space-y-4" onSubmit={handleLogin}>
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
                onClick={() => setShowPassword((current) => !current)}
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
            <div className="flex w-full items-end justify-end">
              <div className="flex flex-col text-center">
                <span className="text-xs text-gray-500">
                  Nao tem uma conta?
                </span>
                <Link
                  className="text-sm text-blue-600 transition-all hover:text-blue-800"
                  to="/register"
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
