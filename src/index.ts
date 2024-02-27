import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import index from "./router/index";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(index);

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("<h2>Express + TypeScript Server</h2>");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://127.0.0.1:${port}`);
});
