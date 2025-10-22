import { Router } from "express";
import { login, signUp } from "../controllers/auth.controller.js";
const authRoute: Router = Router();

authRoute.post("/signup", signUp);
authRoute.post("/login", login)

export default authRoute;       