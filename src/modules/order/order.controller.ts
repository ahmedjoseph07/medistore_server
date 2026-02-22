import { Request, Response } from "express";
import { orderServices } from "./order.service";
import { prisma } from "../../../lib/prisma";

const createOrder = async (req: Request, res: Response) => {
    try {
        const medicine = await orderServices.createOder(req.body)
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: medicine
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await orderServices.getAllOrders()
        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getOrdersById = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params
        const orders = await orderServices.getOrdersById(customerId as string)
        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params
        const order = await orderServices.updateOrderStatus(orderId as string, req.body)
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

export const orderControllers = {
    createOrder,
    getAllOrders,
    getOrdersById,
    updateOrderStatus
}