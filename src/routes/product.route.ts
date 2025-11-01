import { Router } from "express"
import { errorHandler } from "../errorHandler.js";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const productRoutes: Router = Router();

productRoutes.post('/',[authMiddleware, adminMiddleware], errorHandler(createProduct));
productRoutes.put('/:id',[authMiddleware, adminMiddleware], errorHandler(updateProduct));
productRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));
productRoutes.get('/', authMiddleware, errorHandler(listProducts));
productRoutes.get('/:id', authMiddleware, errorHandler(getProductById))
export default productRoutes;