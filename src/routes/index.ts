import { Router } from "express";
import authRouter from "../routes/auth.route.js"
import productRoutes from "./product.route.js";
import userRoutes from "./user.route.js";
import cartRoute from "./cart.route.js";
const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter)
rootRouter.use('/products',productRoutes)
rootRouter.use('/user', userRoutes)
rootRouter.use("/cart", cartRoute)

export default rootRouter