import { Router } from "express";
import { medicineControllers } from "./medicine.controller.js";
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware.js";

const router = Router()

router.post("/seller/medicines", authMiddleware(UserRole.ADMIN, UserRole.SELLER), medicineControllers.createMedicine)
router.get("/seller/medicines/:sellerId", authMiddleware(UserRole.ADMIN, UserRole.SELLER), medicineControllers.getMedicinesBySellerId)
router.put("/seller/medicines/:medicineId", authMiddleware(UserRole.ADMIN, UserRole.SELLER), medicineControllers.updateMedicineById)
router.delete("/seller/medicines/:medicineId", authMiddleware(UserRole.ADMIN, UserRole.SELLER), medicineControllers.deleteMedicineById)

router.get("/medicines", authMiddleware(UserRole.CUSTOMER,UserRole.ADMIN, UserRole.SELLER), medicineControllers.getAllMedicines)
router.get("/medicines/:medicineId", authMiddleware(UserRole.CUSTOMER,UserRole.ADMIN, UserRole.SELLER), medicineControllers.getMedicineById)

export const medicineRoutes = router