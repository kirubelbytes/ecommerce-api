import { Router } from "express";
import authRouter from "../routes/auth.route.js"
const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter)

export default rootRouter