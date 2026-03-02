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
      shipping,
      tax,
      grandTotal,
    } = body

    if (!customerName || !customerEmail || !transactionId || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const sql = getDb()
    const orderId = `BK-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`

    const result = await sql`
      INSERT INTO orders (
        order_id, customer_name, customer_email, customer_phone,
        shipping_address, transaction_id, items,
        subtotal, shipping, tax, grand_total, status
      ) VALUES (
        ${orderId}, ${customerName}, ${customerEmail}, ${customerPhone},
        ${shippingAddress}, ${transactionId}, ${JSON.stringify(items)},
        ${subtotal}, ${shipping}, ${tax}, ${grandTotal}, 'processing'
      )
      RETURNING id, order_id, status, created_at
    `

    return NextResponse.json({
      success: true,
      order: result[0],
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

    const sql = getDb()

    if (orderId) {
      const result = await sql`SELECT * FROM orders WHERE order_id = ${orderId}`
      if (result.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
      return NextResponse.json({ order: result[0] })
    }

    if (email) {
      const result = await sql`
        SELECT * FROM orders WHERE customer_email = ${email}
        ORDER BY created_at DESC
      `
      return NextResponse.json({ orders: result })
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
