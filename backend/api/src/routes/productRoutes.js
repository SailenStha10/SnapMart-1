import express from "express";

import {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/", adminMiddleware, createProduct);

router.get("/", getProducts);

router.get("/:slug", getProductBySlug);

router.put("/:id", adminMiddleware, updateProduct);

router.delete("/:id", adminMiddleware, deleteProduct);

export default router;