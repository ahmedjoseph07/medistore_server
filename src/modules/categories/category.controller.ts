import { Request, Response } from "express";
import { categoryServices } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryServices.createCategory(req.body)
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryServices.getCategories()
        res.status(201).json({
            success: true,
            message: "Category retrieved successfully",
            data: categories
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

export const categoryControllers = {
    createCategory,
    getCategories
}