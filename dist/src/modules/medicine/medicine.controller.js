import { medicineServices } from "./medicine.service.js";
const createMedicine = async (req, res) => {
    try {
        const sellerId = req.user?.id;
        const medicine = await medicineServices.createMedicine(req.body, sellerId);
        res.status(201).json({
            success: true,
            message: "Medicine created successfully",
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
const getMedicinesBySellerId = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const medicines = await medicineServices.getMedicinesBySellerId(sellerId);
        res.status(200).json({
            success: true,
            message: "Medicine retrieved successfully",
            data: medicines
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
const updateMedicineById = async (req, res) => {
    try {
        const { medicineId } = req.params;
        const medicines = await medicineServices.updateMedicineById(medicineId, req.body);
        res.status(200).json({
            success: true,
            message: "Medicine updated successfully",
            data: medicines
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
const deleteMedicineById = async (req, res) => {
    try {
        const { medicineId } = req.params;
        const medicines = await medicineServices.deleteMedicineById(medicineId);
        res.status(200).json({
            success: true,
            message: "Medicine deleted successfully",
            data: medicines
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
const getAllMedicines = async (req, res) => {
    try {
        const medicines = await medicineServices.getAllMedicines();
        res.status(200).json({
            success: true,
            message: "Medicines retrieved successfully",
            data: medicines
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
const getMedicineById = async (req, res) => {
    try {
        const medicineId = req.params.medicineId;
        const medicines = await medicineServices.getMedicineById(medicineId);
        res.status(200).json({
            success: true,
            message: "Medicine retrieved successfully",
            data: medicines
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
export const medicineControllers = {
    createMedicine,
    getAllMedicines,
    updateMedicineById,
    deleteMedicineById,
    getMedicinesBySellerId,
    getMedicineById
};
