import { Router } from "express";
import { login, me, signUp } from "../controllers/auth.controller.js";
import { errorHandler } from "../errorHandler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const authRoute: Router = Router();

authRoute.post("/signup",errorHandler(signUp));
authRoute.post("/login", errorHandler(login));
authRoute.get('/me', [authMiddleware], errorHandler(me))

export default authRoute;       