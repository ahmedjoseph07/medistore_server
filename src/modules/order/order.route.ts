import { Router } from "express";
import { orderControllers } from "./order.controller";

const router = Router()

router.post("/orders", orderControllers.createOrder)
router.get("/orders", orderControllers.getAllOrders)
router.get("/orders/:customerId", orderControllers.getOrdersById)
router.patch("/orders/:orderId/status", orderControllers.updateOrderStatus)
export const orderRoutes = router