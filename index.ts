import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import userRoute from "./src/router/users";
import authRoute from "./src/router/auth";
import postRoute from "./src/router/posts";

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.log("Could not connect to mongodb"));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(6666, () => {
  console.log("Backend is Runing");
});
