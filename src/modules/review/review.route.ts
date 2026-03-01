import { Router } from "express";
import { reviewControllers } from "./review.controller.js";
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware.js";

const router = Router()
router.post("/reviews", authMiddleware(UserRole.CUSTOMER, UserRole.ADMIN), reviewControllers.createReview)
router.get("/reviews/:medicineId", authMiddleware(UserRole.CUSTOMER, UserRole.ADMIN), reviewControllers.getReviewsByMedicineId)
export const reviewRoutes = router