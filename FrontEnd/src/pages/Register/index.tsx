import { Button, Card, CardBody, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

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
      showToast("As senhas não correspondem.", "error");

      return;
    }

    try {
      await register(name, email, password, nickname);
      showToast("Registro realizado com sucesso!", "success");
      navigate("/"); // Redireciona para a página principal após o registro bem-sucedido
    } catch (err) {
      console.error("Falha ao realizar o registro:", err);
      showToast(
        "Falha ao realizar o registro. Verifique os dados informados.",
        "error",
      );
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
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
          <h2 className="text-3xl font-bold text-center mb-6">Registro</h2>
          <form className="space-y-4 w-full" onSubmit={handleRegister}>
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
                  onClick={toggleShowPassword}
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
                  placeholder="Confirmar Senha"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="absolute right-2 top-3 text-gray-500"
                  type="button"
                  onClick={toggleShowConfirmPassword}
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
            <div className="w-full flex justify-end items-end">
              <div className="flex flex-col text-center">
                <span className="text-xs text-gray-500">Já tem uma conta?</span>
                <Link
                  className="text-blue-600 text-sm transition-all hover:text-blue-800"
                  to={"/login"}
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
