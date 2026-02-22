export interface CreateOrderPayload {
    customerId: string;
    phone?: string | null;
    address?: string | null;
    shippingFee?: number;
    items: Array<{ medicineId: string; quantity: number }>;
};

export type UpdateOrderStatusPayload = {
    status: "PLACED" | "PROCESSING" | "CANCELLED" | "SHIPPED" | "DELIVERED";
};
