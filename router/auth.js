const router = require("express").Router();
const User = require("../model/User");
const CryptoJS = require("crypto-js");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

//LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  !user && res.status(401).json("Wrong password or username!");

  const bytes = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

  originalPassword !== req.body.password &&
    res.status(401).json("Wrong password or username!");

  res.status(200).json(user);
});

module.exports = router;
