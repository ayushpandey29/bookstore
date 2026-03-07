import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      transactionId,
      items,
      subtotal,
      tax,
      grandTotal,
    } = body

    if (!customerName || !customerEmail || !transactionId || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const ordersCollection = db.collection("orders")

    const orderId = `BK-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`

    const newOrder = {
      order_id: orderId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: shippingAddress,
      transaction_id: transactionId,
      items,
      subtotal,
      tax,
      grand_total: grandTotal,
      status: 'processing',
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await ordersCollection.insertOne(newOrder)

    return NextResponse.json({
      success: true,
      order: {
        id: result.insertedId.toString(),
        order_id: orderId,
        status: newOrder.status,
        created_at: newOrder.created_at
      },
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const orderId = searchParams.get("orderId")

    const db = await getDb()
    const ordersCollection = db.collection("orders")

    if (orderId) {
      const order = await ordersCollection.findOne({ order_id: orderId })
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
      return NextResponse.json({ order })
    }

    if (email) {
      const orders = await ordersCollection
        .find({ customer_email: email })
        .sort({ created_at: -1 })
        .toArray()

      return NextResponse.json({ orders })
    }

    return NextResponse.json(
      { error: "Provide email or orderId" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
