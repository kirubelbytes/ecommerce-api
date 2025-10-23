import express from "express";
// import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { PORT } from "./config/secrets.js";
import rootRouter from "./routes/index.js";
import { PrismaClient } from "@prisma/client";
import helmet from "helmet";
import { singUpSchema } from "./schemas/user.js";


const app = express();

//Security headers
app.use(helmet());

//Cross-Origin Resource Sharing  
app.use(cors());

// Logger
app.use(morgan("dev"));


app.use(express.json());

//Rate limiter - place here
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 
});
app.use(limiter);

// Routes
app.use("/api/v1", rootRouter);


export const prismaClient = new PrismaClient({
    log : ["query"]
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

 