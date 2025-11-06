import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { errorHandler } from "../errorHandler.js";
import { cancelOrder, createOrder, getOrderById, listOrder } from "../controllers/order.controller.js";

const orderRoute : Router = Router();

orderRoute.post('/', authMiddleware, errorHandler(createOrder))
orderRoute.get("/", authMiddleware, errorHandler(listOrder))
orderRoute.put("/:id/cancel", authMiddleware, errorHandler(cancelOrder))
orderRoute.get('/:id', authMiddleware, errorHandler(getOrderById))

export default orderRoute;