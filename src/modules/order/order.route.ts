import { Router } from "express";
import { orderControllers } from "./order.controller";
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware";

const router = Router()

router.post("/orders", authMiddleware(UserRole.CUSTOMER), orderControllers.createOrder)
router.get("/orders", authMiddleware(UserRole.CUSTOMER, UserRole.ADMIN), orderControllers.getAllOrders)
router.get("/orders/:customerId", authMiddleware(UserRole.CUSTOMER, UserRole.ADMIN), orderControllers.getOrdersById)
router.get("/orders/:orderId/details", authMiddleware(UserRole.CUSTOMER, UserRole.ADMIN), orderControllers.getOrderDetails)
router.patch("/orders/:orderId/status", authMiddleware(UserRole.ADMIN), orderControllers.updateOrderStatus)
export const orderRoutes = router