import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryBySlug
  , updateCategory, deleteCategory
} from "../controllers/categoryController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/", adminMiddleware, createCategory);

router.get("/", getCategories);

router.get("/:slug", getCategoryBySlug);

router.put("/:id", adminMiddleware, updateCategory);

router.delete("/:id", adminMiddleware, deleteCategory);

export default router;