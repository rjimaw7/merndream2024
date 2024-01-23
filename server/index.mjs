import express from "express";
import { mockUsers } from "./utils/constants.mjs";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index.mjs";
import "dotenv/config";

const app = express();

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(`Err: ${err}`));

// Middlewares
app.use(express.json());
app.use(cors());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
