export interface Medicine {
    name: string
    id: string
    description: string | null;
    sku: string | null;
    categoryId: string;
    sellerId: string;
    price: number;
    stock: number;
    isActive: boolean;
    brand: string | null;
    dosageForm: string | null;
    strength: string | null;
    imageUrl: string | null;
}