import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")

    if (!session?.value || !session.value.startsWith("admin_")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = getDb()
    const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Admin orders fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")

    if (!session?.value || !session.value.startsWith("admin_")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, status } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status are required" }, { status: 400 })
    }

    const validStatuses = ["processing", "confirmed", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const sql = getDb()
    const result = await sql`
      UPDATE orders SET status = ${status}, updated_at = NOW()
      WHERE order_id = ${orderId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, order: result[0] })
  } catch (error) {
    console.error("Admin order update error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
