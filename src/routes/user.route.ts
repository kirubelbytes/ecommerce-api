import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { errorHandler } from "../errorHandler.js";
import { addAddress, deleteAddress, listAddress } from "../controllers/user.controller.js";
const userRoutes = Router();

userRoutes.post("/address", authMiddleware, errorHandler(addAddress));
userRoutes.delete("/address/:id", authMiddleware, errorHandler(deleteAddress));
userRoutes.get("/address", authMiddleware, errorHandler(listAddress))
export default userRoutes;