export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  nickname: string;
  score: number;
}

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    nickname: string,
  ) => Promise<void>;
  logout: () => void;
}
