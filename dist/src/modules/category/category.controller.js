import { categoryServices } from "./category.service.js";
const createCategory = async (req, res) => {
    try {
        const category = await categoryServices.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
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
const getCategories = async (req, res) => {
    try {
        const categories = await categoryServices.getCategories();
        res.status(200).json({
            success: true,
            message: "Category retrieved successfully",
            data: categories
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
export const categoryControllers = {
    createCategory,
    getCategories
};
