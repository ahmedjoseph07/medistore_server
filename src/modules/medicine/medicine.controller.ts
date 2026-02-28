import { Request, Response } from "express";
import { medicineServices } from "./medicine.service.js";
import paginationSortingHelper from "../../helpers/paginationSortingHelper.js";

const createMedicine = async (req: Request, res: Response) => {
    try {
        const sellerId = req.user?.id as string
        const medicine = await medicineServices.createMedicine(req.body, sellerId)
        res.status(201).json({
            success: true,
            message: "Medicine created successfully",
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

const getMedicinesBySellerId = async (req: Request, res: Response) => {
    try {
        const sellerId = req.params.sellerId as string
        const medicines = await medicineServices.getMedicinesBySellerId(sellerId)
        res.status(200).json({
            success: true,
            message: "Medicine retrieved successfully",
            data: medicines
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const updateMedicineById = async (req: Request, res: Response) => {
    try {
        const { medicineId } = req.params
        const medicines = await medicineServices.updateMedicineById(medicineId as string, req.body)
        res.status(200).json({
            success: true,
            message: "Medicine updated successfully",
            data: medicines
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const deleteMedicineById = async (req: Request, res: Response) => {
    try {
        const { medicineId } = req.params
        const medicines = await medicineServices.deleteMedicineById(medicineId as string)
        res.status(200).json({
            success: true,
            message: "Medicine deleted successfully",
            data: medicines
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getAllMedicines = async (req: Request, res: Response) => {
    try {
        const { search, dosageForm, brand, minPrice, maxPrice } = req.query
        const dosageFormString = typeof dosageForm === 'string' ? dosageForm : undefined
        const searchString = typeof search === 'string' ? search : undefined
        const brandString = typeof brand === 'string' ? brand : undefined
        const isActive = req.query.isActive ? req.query.isActive === 'true' : undefined
        const minPriceNumber = typeof minPrice === "string" && minPrice.trim() !== "" && !Number.isNaN(Number(minPrice)) ? Number(minPrice) : undefined
        const maxPriceNumber = typeof maxPrice === "string" && maxPrice.trim() !== "" && !Number.isNaN(Number(maxPrice)) ? Number(maxPrice) : undefined

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

        const medicines = await medicineServices.getAllMedicines({
            search: searchString,
            dosageForm: dosageFormString,
            brand: brandString,
            isActive,
            minPrice: minPriceNumber,
            maxPrice: maxPriceNumber,
            limit,
            page,
            sortBy,
            sortOrder,
            skip
        })

        res.status(200).json({
            success: true,
            message: "Medicines retrieved successfully",
            data: medicines
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getMedicineById = async (req: Request, res: Response) => {
    try {
        const medicineId = req.params.medicineId as string
        const medicines = await medicineServices.getMedicineById(medicineId)
        res.status(200).json({
            success: true,
            message: "Medicine retrieved successfully",
            data: medicines
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}



export const medicineControllers = {
    createMedicine,
    getAllMedicines,
    updateMedicineById,
    deleteMedicineById,
    getMedicinesBySellerId,
    getMedicineById
}