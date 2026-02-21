import { Router } from "express";
import { categoryControllers } from "./category.controller";

const router = Router();

router.post("/categories", categoryControllers.createCategory)
router.get("/categories", categoryControllers.getCategories)

export const categoryRoutes = router