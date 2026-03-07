import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const adminCollection = db.collection("admin_users")

    let admin = await adminCollection.findOne({ username })

    // Seed default admin if none exists for 'admin'
    if (!admin && username === "admin") {
      const defaultHash = await bcrypt.hash("password123", 10)
      const res = await adminCollection.insertOne({ username: "admin", password_hash: defaultHash })
      admin = { _id: res.insertedId, username: "admin", password_hash: defaultHash }
    }

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, admin.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const sessionToken = `admin_${admin._id.toString()}_${Date.now()}_${Math.random().toString(36).substring(2)}`

    const cookieStore = await cookies()
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    return NextResponse.json({
      success: true,
      admin: { id: admin._id.toString(), username: admin.username },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
