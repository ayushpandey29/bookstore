import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/db"

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        const sql = getDb()
        const result = await sql`SELECT * FROM users WHERE email = ${email}`

        if (result.length === 0) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            )
        }

        const user = result[0]
        const passwordMatch = await bcrypt.compare(password, user.password_hash)

        if (!passwordMatch) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            )
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { error: "Login failed" },
            { status: 500 }
        )
    }
}
