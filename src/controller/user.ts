import { Request, Response } from "express";
import User from "../model/User";
import CryptoJS from "crypto-js";

// update User
export const updateUser = async (req: Request, res: Response) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC!
      ).toString();
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("account has been updated");
  } else {
    return res.status(403).json("you can update only your account");
  }
};

//delete User
export const deleteUser = async (req: Request, res: Response) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account has been deleted");
  } else {
    return res.status(403).json("You can delete only your account!");
  }
};

//get user
export const getUser = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const username = req.query.username;

  const user = userId
    ? await User.findById(userId)
    : await User.findOne({ username: username });
  const { password, updatedAt, ...other } = user._doc;
  res.status(200).json(other);
};

//follow user
export const fallow = async (req: Request, res: Response) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (!user.followers.includes(req.body.userId)) {
      await user.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({ $push: { followings: req.params.id } });
      res.status(200).json("user has been followed");
    } else {
      res.status(403).json("you already fallow this user");
    }
  } else {
    res.status(403).json("you cant fallow yourself");
  }
};

//unfollow user
export const unfollow = async (req: Request, res: Response) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (!user.followers.includes(req.body.userId)) {
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });
      res.status(200).json("user has been unollowed");
    } else {
      res.status(403).json("you already unfallow this user");
    }
  } else {
    res.status(403).json("you cant unfallow yourself");
  }
};
