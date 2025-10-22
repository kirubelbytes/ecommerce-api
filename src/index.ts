import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.get("/", (_, res) => res.send("API running..."));

app.listen(3000, () => console.log(`Server on http://localhost:${PORT}`));
