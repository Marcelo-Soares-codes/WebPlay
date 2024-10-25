import { Request, Response } from "express";
import UserRepository from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as yup from "yup";

// Definindo o esquema de validação para o registro
const registerSchema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
  nickname: yup.string().required("O nickname é obrigatório"),
});

// Definindo o esquema de validação para o login
const loginSchema = yup.object().shape({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
});

class AuthController {
  async login(req: Request, res: Response) {
    try {
      // Valida os dados de entrada com o esquema do login
      await loginSchema.validate(req.body, { abortEarly: false });

      const { email, password } = req.body;

      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Email ou senha inválidos" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        },
      );

      // Retorna o token e o usuário (sem a senha)
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ token, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async register(req: Request, res: Response) {
    try {
      // Valida os dados de entrada com o esquema do registro
      await registerSchema.validate(req.body, { abortEarly: false });

      const { email, password, name, nickname } = req.body;

      // Verifica se o email já está cadastrado
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      // Verifica se o nickname já está em uso
      const existingNickname = await UserRepository.findByNickname(nickname);
      if (existingNickname) {
        return res.status(400).json({ message: "Nickname já está em uso" });
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria o usuário
      const newUser = await UserRepository.create({
        email,
        password: hashedPassword,
        name,
        nickname,
        score: 0, // O score inicial será 0
      });

      // Gera um token JWT para o novo usuário
      const token = jwt.sign(
        { id: newUser.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        },
      );

      // Retorna o token e o usuário (sem a senha)
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}

export default new AuthController();
