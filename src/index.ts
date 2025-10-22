import express from "express";
import type { Express, Request ,Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app:Express = express();
const PORT = process.env.PORT;

app.use(express.json());
app.get("/", (req:Request, res:Response) => res.send("API running..."));

app.listen(3000, () => console.log(`Server on http://localhost:${PORT}`));
