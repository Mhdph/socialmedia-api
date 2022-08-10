import express, { Request, Response } from "express";
import CryptoJS from "crypto-js";
import User from "../model/User";
const router = express.Router();

export const register = async (req: Request, res: Response) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC!
    ).toString(),
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
};

export const Login = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  !user && res.status(401).json("Wrong password or username!");

  const bytes = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC!);
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

  originalPassword !== req.body.password &&
    res.status(401).json("Wrong password or username!");

  res.status(200).json(user);
};
