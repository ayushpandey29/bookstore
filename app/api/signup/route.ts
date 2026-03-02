import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/db"

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json()

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            )
        }

        const sql = getDb()

        // Check if user already exists
        const existing = await sql`SELECT id FROM users WHERE email = ${email}`
        if (existing.length > 0) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email
    `

        return NextResponse.json({
            success: true,
            user: result[0],
        })
    } catch (error) {
        console.error("Signup error:", error)
        return NextResponse.json(
            { error: "Failed to create account" },
            { status: 500 }
        )
    }
}
