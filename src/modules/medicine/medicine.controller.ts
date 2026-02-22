import { Request, Response } from "express";
import { medicineServices } from "./medicine.service";

const createMedicine = async (req: Request, res: Response) => {
    try {
        const medicine = await medicineServices.createMedicine(req.body)
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
        const medicines = await medicineServices.getAllMedicines()
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