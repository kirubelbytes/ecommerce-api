import { Router } from "express";
import authRouter from "../routes/auth.route.js"
import productRoutes from "./product.route.js";
const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter)
rootRouter.use('/products',productRoutes)

export default rootRouter