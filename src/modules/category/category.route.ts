import { Router } from "express";
import { categoryControllers } from "./category.controller";
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware";


const router = Router();

router.post("/categories", categoryControllers.createCategory)
router.get("/categories", authMiddleware(UserRole.CUSTOMER), categoryControllers.getCategories)

export const categoryRoutes = router