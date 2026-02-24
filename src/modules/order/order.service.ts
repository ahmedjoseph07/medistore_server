import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateOrderPayload, UpdateOrderStatusPayload } from "./order.type";

const createOder = async (payload: CreateOrderPayload, userId: string) => {
    const shippingFee = payload.shippingFee ?? 0;

    // Loading Medicines
    const medicineIds = [...new Set(payload.items.map((i) => i.medicineId))]
    // const medicineIds = payload.items.map((i) => i.medicineId)
    const medicines = await prisma.medicine.findMany({
        where: {
            id: { in: medicineIds }, isActive: true
        },
        select: {
            id: true, price: true, stock: true
        }
    })

    if (medicines.length !== medicineIds.length) {
        throw new Error("One or more medicines not found / inactive");
    }

    const medMap = new Map(medicines.map((m) => [m.id, m]))

    let subtotal = new Prisma.Decimal(0)

    const orderItemsData = payload.items.map((i) => {
        const med = medMap.get(i.medicineId)!
        if (i.quantity <= 0) throw new Error("Quantity must be > 0")
        if (med.stock < i.quantity) throw new Error("Insufficient stock for medicineId=${i.medicineId}")

        const unitPrice = med.price
        const linePrice = unitPrice.mul(i.quantity)

        subtotal = subtotal.add(linePrice)

        return {
            medicineId: i.medicineId,
            quantity: i.quantity,
            unitPrice,
            linePrice
        }
    })

    const total = subtotal.add(new Prisma.Decimal(shippingFee))

    // Prsima Transaction (Create Order + Items + Decrement Stock )
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                customerId: userId,
                status: "PLACED",
                subtotal,
                shippingFee: new Prisma.Decimal(shippingFee),
                total,
                phone: payload.phone ?? null,
                address: payload.address ?? null,
                orderItems: {
                    create: orderItemsData.map((it) => ({
                        medicineId: it.medicineId,
                        quantity: it.quantity,
                        unitPrice: it.unitPrice,
                        linePrice: it.linePrice,
                    }))
                }
            },
            include: { orderItems: true }
        })

        for (const i of payload.items) {
            await tx.medicine.update({
                where: { id: i.medicineId },
                data: { stock: { decrement: i.quantity } }
            })
        }

        return order
    })

}

const getAllOrders = async () => {
    const result = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { orderItems: true }
    })
    return result
}

const getOrdersById = async (customerId: string) => {
    const result = prisma.order.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
        include: { orderItems: true }
    })
    return result;
}

const updateOrderStatus = async (orderId: string, payload: UpdateOrderStatusPayload) => {
    const result = await prisma.order.update({
        where: { id: orderId },
        data: { status: payload.status }
    })
}

const getOrderDetails = async (orderId: string) => {
    console.log(orderId)
    const result = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true }
    })
    console.log(result)
    return result
}

export const orderServices = {
    createOder,
    getAllOrders,
    getOrdersById,
    updateOrderStatus,
    getOrderDetails
}