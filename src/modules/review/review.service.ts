import { prisma } from "../../lib/prisma.js";

const createReview = async (payload: {
    comment?: string;
    rating: number;
    medicineId: string;
    userId: string
}) => {

    const review = await prisma.review.create({
        data: payload
    })
    return review
}
const getReviewsByMedicineId = async (medicineId: string) => {
    const result = await prisma.review.findMany({
        where: {
            medicineId
        }
    })
    return result
}
export const reviewServices = {
    createReview,
    getReviewsByMedicineId
}