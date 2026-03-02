// In-memory order store for local development (no database needed)
// This is used when DATABASE_URL is not set

export interface OrderRecord {
    id: number
    order_id: string
    customer_name: string
    customer_email: string
    customer_phone: string
    shipping_address: string
    transaction_id: string
    items: string
    subtotal: number
    shipping: number
    tax: number
    grand_total: number
    status: string
    created_at: string
    updated_at: string
}

let nextId = 2
const orders: Map<string, OrderRecord> = new Map()

// Seed with a sample order
const sampleOrder: OrderRecord = {
    id: 1,
    order_id: "BK-SAMPLE001",
    customer_name: "Rahul Sharma",
    customer_email: "rahul@example.com",
    customer_phone: "9876543210",
    shipping_address: "42 MG Road, Bangalore, Karnataka - 560001",
    transaction_id: "UPI-SAMPLE-12345",
    items: JSON.stringify([
        {
            bookId: "1",
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 499,
            quantity: 1,
            cover: "/images/book-placeholder.jpg",
        },
        {
            bookId: "2",
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            price: 399,
            quantity: 2,
            cover: "/images/book-placeholder.jpg",
        },
    ]),
    subtotal: 1297,
    shipping: 0,
    tax: 65,
    grand_total: 1362,
    status: "processing",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}
orders.set(sampleOrder.order_id, sampleOrder)

export function isLocalMode(): boolean {
    return !process.env.DATABASE_URL
}

export function getAllOrders(): OrderRecord[] {
    return Array.from(orders.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
}

export function getOrderById(orderId: string): OrderRecord | undefined {
    return orders.get(orderId)
}

export function getOrdersByEmail(email: string): OrderRecord[] {
    return Array.from(orders.values())
        .filter((o) => o.customer_email === email)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function createOrder(data: {
    customerName: string
    customerEmail: string
    customerPhone: string
    shippingAddress: string
    transactionId: string
    items: unknown[]
    subtotal: number
    shipping: number
    tax: number
    grandTotal: number
}): OrderRecord {
    const orderId = `BK-${Date.now().toString(36).toUpperCase()}${Math.random()
        .toString(36)
        .substring(2, 5)
        .toUpperCase()}`
    const now = new Date().toISOString()
    const order: OrderRecord = {
        id: nextId++,
        order_id: orderId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        shipping_address: data.shippingAddress,
        transaction_id: data.transactionId,
        items: JSON.stringify(data.items),
        subtotal: data.subtotal,
        shipping: data.shipping,
        tax: data.tax,
        grand_total: data.grandTotal,
        status: "processing",
        created_at: now,
        updated_at: now,
    }
    orders.set(orderId, order)
    return order
}

export function updateOrderStatus(
    orderId: string,
    status: string
): OrderRecord | null {
    const order = orders.get(orderId)
    if (!order) return null
    order.status = status
    order.updated_at = new Date().toISOString()
    return order
}
