import { Request, Response } from "express"
import { reviewServices } from "./review.service.js"


const createReview = async (req: Request, res: Response) => {
    try {
        req.body.userId = req.user?.id as string
        const review = await reviewServices.createReview(req.body)
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getReviewsByMedicineId = async (req: Request, res: Response) => {
    try {
        const medicineId = req.params.medicineId as string
        const reviews = await reviewServices.getReviewsByMedicineId(medicineId)
        res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully",
            data: reviews
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

export const reviewControllers = {
    createReview,
    getReviewsByMedicineId
}