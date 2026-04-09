import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import * as yup from "yup";

import { signToken, verifyToken } from "../auth";
import { connectToDatabase } from "../lib/mongoose";
import { UserModel } from "../models/User";

const registerSchema = yup.object({
  name: yup.string().required("O nome e obrigatorio"),
  email: yup.string().email("Email invalido").required("O email e obrigatorio"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha e obrigatoria"),
  nickname: yup.string().required("O nickname e obrigatorio"),
});

const loginSchema = yup.object({
  email: yup.string().email("Email invalido").required("O email e obrigatorio"),
  password: yup.string().required("A senha e obrigatoria"),
});

type DatabaseUser = {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  nickname: string;
  photo?: string | null;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};

function sanitizeUser(user: DatabaseUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    nickname: user.nickname,
    photo: user.photo ?? null,
    score: user.score,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  nickname: string;
}) {
  await connectToDatabase();
  await registerSchema.validate(payload, { abortEarly: false });

  const normalizedEmail = payload.email.toLowerCase();
  const existingEmail = await UserModel.findOne({ email: normalizedEmail });

  if (existingEmail) {
    throw new Error("Email ja cadastrado");
  }

  const existingNickname = await UserModel.findOne({
    nickname: payload.nickname,
  });

  if (existingNickname) {
    throw new Error("Nickname ja esta em uso");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UserModel.create({
    ...payload,
    email: normalizedEmail,
    password: hashedPassword,
    score: 0,
  });

  return {
    token: signToken(user._id.toString()),
    user: sanitizeUser(user),
  };
}

export async function loginUser(payload: { email: string; password: string }) {
  await connectToDatabase();
  await loginSchema.validate(payload, { abortEarly: false });

  const user = await UserModel.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    throw new Error("Email ou senha invalidos");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Credenciais invalidas");
  }

  return {
    token: signToken(user._id.toString()),
    user: sanitizeUser(user),
  };
}

export async function validateUserToken(token: string) {
  const decoded = verifyToken(token);

  return {
    message: "Token valido",
    decoded,
  };
}
