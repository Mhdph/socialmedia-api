const router = require("express").Router();
import CryptoJS from "crypto-js";
import { Login, register } from "../controller/auth";

//REGISTER
router.post("/register", register);

//LOGIN
router.post("/login", Login);

export default router;
