import express from "express";
import User from "../model/User";
import CryptoJS from "crypto-js";
import {
  deleteUser,
  fallow,
  getUser,
  unfollow,
  updateUser,
} from "../controller/user";

const router = express.Router();
//update
router.put("/:id", updateUser);

//delete
router.delete("/:id", deleteUser);

//get
router.get("/", getUser);

//fallow
router.put("/:id/follow", fallow);

//unfollow
router.put("/:id/unfollow", unfollow);

export default router;
