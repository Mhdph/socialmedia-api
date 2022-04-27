const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const { use } = require("express/lib/application");

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.log("Could not connect to mongodb"));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.listen(8888, () => {
  console.log("Backend is Runing");
});
