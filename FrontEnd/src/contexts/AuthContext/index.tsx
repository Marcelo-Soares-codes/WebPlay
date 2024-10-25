// src/contexts/AuthContext.tsx

import Cookies from "js-cookie";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

import authApi from "../../../utils/api/authApi";

import { AuthContextData, User } from "./types";

import { useToast } from "@/contexts/ToastContext";

const defaultAuthContext: AuthContextData = {
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextData>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token && user) {
      // Função para verificar se o token é válido
      const validateToken = async () => {
        try {
          // Verifica se o token é válido chamando a API
          await authApi.validateToken();
          setUser(JSON.parse(localStorage.getItem("user") || "null"));
        } catch (error) {
          // Caso o token não seja válido, faz logout
          logout();
        } finally {
          setLoading(false);
        }
      };

      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await authApi.login({ email, password });

      Cookies.set("token", token, {
        expires: 7,
        sameSite: "Lax",
        secure: true,
      });

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      showToast("Login realizado com sucesso!", "success");
    } catch (error: unknown) {
      let errorMessage =
        "Falha ao realizar o login. Verifique suas credenciais.";

      if (error instanceof Error && "response" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosError = error as any;

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      showToast(errorMessage, "error");
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    nickname: string,
  ) => {
    try {
      const { token, user } = await authApi.register({
        name,
        email,
        password,
        nickname,
      });

      Cookies.set("token", token, {
        expires: 7,
        sameSite: "Lax",
        secure: true,
      });

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      showToast("Cadastro realizado com sucesso!", "success");
    } catch (error: unknown) {
      let errorMessage = "Erro ao registrar. Por favor, tente novamente.";

      if (error instanceof Error && "response" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosError = error as any;

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      showToast(errorMessage, "error");
      console.error("Erro ao registrar:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);

    showToast("Logout realizado com sucesso!", "success");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
