import { Router } from "express";
import { categoryControllers } from "./category.controller";

const router = Router();

router.post("/admin/categories", categoryControllers.createCategory)
router.get("/admin/categories", categoryControllers.getCategories)

export const categoryRoutes = router