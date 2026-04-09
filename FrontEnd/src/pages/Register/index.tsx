import type React from "react";

import { Button, Card, CardBody, Input } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      showToast("As senhas nao correspondem.", "error");

      return;
    }

    try {
      await register(name, email, password, nickname);
      showToast("Registro realizado com sucesso!", "success");
      navigate("/");
    } catch {
      showToast(
        "Falha ao realizar o registro. Verifique os dados informados.",
        "error",
      );
    }
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
          <h2 className="mb-6 text-center text-3xl font-bold">Registro</h2>
          <form className="w-full space-y-4" onSubmit={handleRegister}>
            <Input
              required
              className="w-full"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              required
              className="w-full"
              placeholder="Apelido"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <Input
              required
              className="w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex space-x-0 sm:space-x-2">
              <div className="relative w-full">
                <Input
                  required
                  className="w-full"
                  classNames={{ input: "pr-5" }}
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
              <div className="relative w-full">
                <Input
                  required
                  className="w-full"
                  classNames={{ input: "pr-5" }}
                  placeholder="Confirmar senha"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="absolute right-2 top-3 text-gray-500"
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>
            <Button
              fullWidth
              className="text-white"
              color="primary"
              type="submit"
            >
              Registrar
            </Button>
            <div className="flex w-full items-end justify-end">
              <div className="flex flex-col text-center">
                <span className="text-xs text-gray-500">Ja tem uma conta?</span>
                <Link
                  className="text-sm text-blue-600 transition-all hover:text-blue-800"
                  to="/login"
                >
                  Fazer login
                </Link>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
};

export default Register;
