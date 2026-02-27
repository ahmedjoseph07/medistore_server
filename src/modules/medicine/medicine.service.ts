import { prisma } from "../../lib/prisma.js"
import { Medicine } from "./medicine.type.js"
import { MedicineWhereInput } from "../../../generated/prisma/models.js"
import { ADDRCONFIG } from "node:dns"


const createMedicine = async (payload: Medicine, sellerId: string) => {

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
    })
    return result
}

const getMedicinesBySellerId = async (sellerId: string) => {
    const result = await prisma.medicine.findMany({
        where: {
            sellerId
        }
    })

    return result
}

const updateMedicineById = async (medicineId: string, payload: Partial<Medicine>) => {
    const result = await prisma.medicine.update({
        where: {
            id: medicineId
        },
        data: payload
    })
    return result
}

const deleteMedicineById = async (medicineId: string) => {
    const result = await prisma.medicine.delete({
        where: {
            id: medicineId
        }
    })
    return result
}

const getAllMedicines = async (payload: {
    search?: string | undefined,
    dosageForm?: string | undefined,
    brand?: string | undefined,
    isActive?: boolean | undefined,
    minPrice?: number | undefined,
    maxPrice?: number | undefined
}) => {
    const { search, dosageForm, brand, isActive, minPrice, maxPrice } = payload
    const andConditions: MedicineWhereInput[] = []
    if (search) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    brand: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ]
        })
    }
    if (dosageForm) {
        andConditions.push({
            dosageForm: {
                contains: payload.dosageForm as string,
                mode: "insensitive"
            }
        })
    }

    if (brand) {
        andConditions.push({
            brand: {
                contains: brand,
                mode: "insensitive"
            }
        })
    }

    if (typeof isActive === 'boolean') {
        andConditions.push({
            isActive
        })
    }

    if (typeof minPrice === "number" || typeof maxPrice === "number") {
        andConditions.push({
            price: {
                ...(typeof minPrice === "number" ? { gte: minPrice } : {}),
                ...(typeof maxPrice === "number" ? { lte: maxPrice } : {}),
            },
        })
    }
    
    const result = await prisma.medicine.findMany({
        where: {
            AND: andConditions
        }
    })
    return result
}

const getMedicineById = async (medicineId: string) => {
    const result = await prisma.medicine.findMany({
        where: {
            id: medicineId
        }
    })
    return result
}

export const medicineServices = {
    createMedicine,
    getAllMedicines,
    updateMedicineById,
    deleteMedicineById,
    getMedicinesBySellerId,
    getMedicineById
}