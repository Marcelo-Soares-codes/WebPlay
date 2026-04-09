export interface User {
  id: string;
  name: string;
  email: string;
  nickname: string;
  score: number;
  photo?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
