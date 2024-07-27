export enum OrderStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export const OrderStatusList = [OrderStatus.DELIVERED, OrderStatus.PENDING, OrderStatus.CANCELLED];
