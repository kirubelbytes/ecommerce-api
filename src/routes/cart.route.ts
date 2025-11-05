import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { errorHandler } from "../errorHandler.js";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart.controller.js";
const cartRoute: Router = Router();

cartRoute.post('/', authMiddleware, errorHandler(addItemToCart))
cartRoute.get('/', authMiddleware, errorHandler(getCart))
cartRoute.delete('/:id', authMiddleware, errorHandler(deleteItemFromCart))
cartRoute.put('/:id', authMiddleware,errorHandler(changeQuantity) )

export default cartRoute