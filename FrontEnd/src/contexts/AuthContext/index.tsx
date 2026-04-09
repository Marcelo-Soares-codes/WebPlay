import type { AuthContextData, User } from "./types";
import type { AxiosError } from "axios";
import type { ReactNode } from "react";

import Cookies from "js-cookie";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useToast } from "@/contexts/ToastContext";

import authApi from "../../../utils/api/authApi";

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

function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem("user") || "null") as User | null;
  } catch {
    localStorage.removeItem("user");

    return null;
  }
}

function persistUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  const axiosError = error as AxiosError<{ message?: string | string[] }>;
  const message = axiosError.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallbackMessage;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const isAuthenticated = Boolean(user);

  const clearSession = useCallback(() => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    showToast("Logout realizado com sucesso!", "success");
  }, [clearSession, showToast]);

  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = getStoredUser();

    if (!token || !storedUser) {
      clearSession();
      setLoading(false);

      return;
    }

    const validateToken = async () => {
      try {
        const response = await authApi.validateToken();
        const currentUser = getStoredUser();

        if (currentUser && response?.decoded?.id) {
          const normalizedUser = {
            ...currentUser,
            id: response.decoded.id,
          };

          persistUser(normalizedUser);
          setUser(normalizedUser);
        } else {
          setUser(currentUser);
        }
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    void validateToken();
  }, [clearSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { token, user: authenticatedUser } = await authApi.login({
          email,
          password,
        });

        Cookies.set("token", token, {
          expires: 7,
          sameSite: "Lax",
          secure:
            typeof window !== "undefined"
              ? window.location.protocol === "https:"
              : false,
        });

        persistUser(authenticatedUser);
        setUser(authenticatedUser);
        showToast("Login realizado com sucesso!", "success");
      } catch (error) {
        showToast(
          getApiErrorMessage(
            error,
            "Falha ao realizar o login. Verifique suas credenciais.",
          ),
          "error",
        );
        throw error;
      }
    },
    [showToast],
  );

  const register = useCallback(
    async (name: string, email: string, password: string, nickname: string) => {
      try {
        const { token, user: authenticatedUser } = await authApi.register({
          name,
          email,
          password,
          nickname,
        });

        Cookies.set("token", token, {
          expires: 7,
          sameSite: "Lax",
          secure:
            typeof window !== "undefined"
              ? window.location.protocol === "https:"
              : false,
        });

        persistUser(authenticatedUser);
        setUser(authenticatedUser);
        showToast("Cadastro realizado com sucesso!", "success");
      } catch (error) {
        showToast(
          getApiErrorMessage(
            error,
            "Erro ao registrar. Por favor, tente novamente.",
          ),
          "error",
        );
        throw error;
      }
    },
    [showToast],
  );

  const value = useMemo(
    () => ({ user, isAuthenticated, login, register, logout }),
    [isAuthenticated, login, logout, register, user],
  );

  return (
    <AuthContext.Provider value={value}>
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
