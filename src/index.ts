import express from "express";
import type { Express, Request ,Response } from "express";
import { PORT } from "./config/secrets.js";
const app:Express = express();

app.use(express.json());
app.get("/", (req:Request, res:Response) => res.send("API running..."));

app.listen(3000, () => console.log(`Server on http://localhost:${PORT}`));
