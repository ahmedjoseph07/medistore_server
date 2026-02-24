import { prisma } from "../../lib/prisma.js";
const createCategory = async (payload) => {
    const result = await prisma.category.create({
        data: {
            key: payload.key,
            name: payload.name,
            sortOrder: payload.sortOrder ?? 0,
            isActive: payload.isActive ?? true,
            ...(payload.nameBn !== undefined ? { nameBn: payload.nameBn } : {})
        },
    });
    return result;
};
const getCategories = async () => {
    const result = await prisma.category.findMany();
    return result;
};
export const categoryServices = {
    createCategory,
    getCategories
};
