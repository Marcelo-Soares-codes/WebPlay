// src/controllers/UserController.ts
import { Request, Response } from "express";
import UserRepository from "../repositories/UserRepository";

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, nickname, score } = req.body;
      const user = await UserRepository.create({
        name,
        email,
        password,
        nickname,
        score,
      });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: "Error creating user" });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await UserRepository.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: "Error fetching user" });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserRepository.findAll();
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: "Error fetching users" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email, nickname, score } = req.body;
      const user = await UserRepository.update(id, {
        name,
        email,
        nickname,
        score,
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: "Error updating user" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await UserRepository.delete(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: "Error deleting user" });
    }
  }
}

export default UserController;
