import { Router } from "express";
import { medicineControllers } from "./medicine.controller";

const router = Router()

router.post("/seller/medicines",medicineControllers.createMedicine)
router.get("/seller/medicines/:sellerId",medicineControllers.getMedicinesBySellerId)
router.put("/seller/medicines/:medicineId",medicineControllers.updateMedicineById)
router.delete("/seller/medicines/:medicineId",medicineControllers.deleteMedicineById)

router.get("/medicines",medicineControllers.getAllMedicines)

export const medicineRoutes = router