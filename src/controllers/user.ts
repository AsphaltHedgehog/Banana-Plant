import { Request, Response } from "express";
import User from "../models/User";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await User.findOne;
};
