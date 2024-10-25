import api from "./api";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  nickname: string;
}

interface LoginData {
  email: string;
  password: string;
}

class AuthApi {
  // Método para registrar um novo usuário
  async register(data: RegisterData) {
    try {
      const response = await api.post("/auth/register", data);

      return response.data; // Retorna o token e outras informações, se necessário
    } catch (error) {
      throw error; // Lida com o erro externamente
    }
  }

  // Método para login de usuário
  async login(data: LoginData) {
    try {
      const response = await api.post("/auth/login", data);

      return response.data; // Retorna o token e outras informações
    } catch (error) {
      throw error; // Lida com o erro externamente
    }
  }
}

export default new AuthApi();
