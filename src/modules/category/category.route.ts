import { Router } from "express";
import { categoryControllers } from "./category.controller.js";
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware.js";


const router = Router();

router.post("/categories", authMiddleware(UserRole.ADMIN), categoryControllers.createCategory)
router.get("/categories", authMiddleware(UserRole.ADMIN), categoryControllers.getCategories)

export const categoryRoutes = router