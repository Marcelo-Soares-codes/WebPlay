import { User } from "@prisma/client";
import prisma from "../utils/db/prisma";

class UserRepository {
  async create(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    return prisma.user.create({
      data: userData,
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async update(
    id: string,
    userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async delete(id: string): Promise<User | null> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByNickname(nickname: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { nickname },
    });
  }
}

export default new UserRepository();
