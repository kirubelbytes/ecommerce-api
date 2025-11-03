import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { errorHandler } from "../errorHandler.js";
import { addAddress } from "../controllers/user.controller.js";
const userRoutes = Router();

userRoutes.post("/address", [authMiddleware, adminMiddleware], errorHandler(addAddress))
export default userRoutes;