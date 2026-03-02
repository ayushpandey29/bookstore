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

    const sql = getDb()
    const result = await sql`SELECT * FROM admin_users WHERE username = ${username}`

    if (result.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const admin = result[0]
    const passwordMatch = await bcrypt.compare(password, admin.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const sessionToken = `admin_${admin.id}_${Date.now()}_${Math.random().toString(36).substring(2)}`

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
      admin: { id: admin.id, username: admin.username },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
