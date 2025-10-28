import { Router } from "express";
import { login, signUp } from "../controllers/auth.controller.js";
import { errorHandler } from "../errorHandler.js";
const authRoute: Router = Router();

authRoute.post("/signup",errorHandler(signUp));
authRoute.post("/login", errorHandler(login))

export default authRoute;       