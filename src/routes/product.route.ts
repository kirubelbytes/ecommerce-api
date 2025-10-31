import { Router } from "express"
import { errorHandler } from "../errorHandler.js";
import { createProduct, deleteProduct, updateProduct } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const productRoutes: Router = Router();

productRoutes.post('/',[authMiddleware, adminMiddleware], errorHandler(createProduct));
productRoutes.put('/:id',[authMiddleware, adminMiddleware], errorHandler(updateProduct));
productRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));

export default productRoutes;