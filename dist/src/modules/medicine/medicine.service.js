import { prisma } from "../../lib/prisma.js";
const createMedicine = async (payload, sellerId) => {
    const result = await prisma.medicine.create({
        data: {
            name: payload.name,
            categoryId: payload.categoryId,
            sellerId,
            description: payload.description,
            brand: payload.brand,
            price: payload.price,
            stock: payload.stock ?? 0,
            isActive: payload.isActive ?? true,
            dosageForm: payload.dosageForm,
            imageUrl: payload.imageUrl,
            sku: payload.sku,
            strength: payload.strength
        }
    });
    return result;
};
const getMedicinesBySellerId = async (sellerId) => {
    const result = await prisma.medicine.findMany({
        where: {
            sellerId
        }
    });
    return result;
};
const updateMedicineById = async (medicineId, payload) => {
    const result = await prisma.medicine.update({
        where: {
            id: medicineId
        },
        data: payload
    });
    return result;
};
const deleteMedicineById = async (medicineId) => {
    const result = await prisma.medicine.delete({
        where: {
            id: medicineId
        }
    });
    return result;
};
const getAllMedicines = async () => {
    const result = await prisma.medicine.findMany();
    return result;
};
const getMedicineById = async (medicineId) => {
    const result = await prisma.medicine.findMany({
        where: {
            id: medicineId
        }
    });
    return result;
};
export const medicineServices = {
    createMedicine,
    getAllMedicines,
    updateMedicineById,
    deleteMedicineById,
    getMedicinesBySellerId,
    getMedicineById
};
