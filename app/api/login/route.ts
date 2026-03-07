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

        const db = await getDb()
        const usersCollection = db.collection("users")

        const user = await usersCollection.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            )
        }

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
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { error: "Login failed", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
