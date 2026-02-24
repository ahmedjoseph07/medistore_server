import { orderServices } from "./order.service.js";
const createOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const medicine = await orderServices.createOder(req.body, userId);
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: medicine
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
};
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderServices.getAllOrders();
        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
};
const getOrdersById = async (req, res) => {
    try {
        const { customerId } = req.params;
        const orders = await orderServices.getOrdersById(customerId);
        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderServices.updateOrderStatus(orderId, req.body);
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
};
const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderServices.getOrderDetails(orderId);
        res.status(200).json({
            success: true,
            message: "Order details retrieved successfully",
            data: order
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
};
export const orderControllers = {
    createOrder,
    getAllOrders,
    getOrdersById,
    updateOrderStatus,
    getOrderDetails
};
