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

        const db = await getDb()
        const usersCollection = db.collection("users")

        // Check if user already exists
        const existing = await usersCollection.findOne({ email })
        if (existing) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = {
            name,
            email,
            password_hash: hashedPassword,
            created_at: new Date()
        }

        const result = await usersCollection.insertOne(newUser)

        return NextResponse.json({
            success: true,
            user: {
                id: result.insertedId.toString(),
                name: newUser.name,
                email: newUser.email
            },
        })
    } catch (error) {
        console.error("Signup error:", error)
        return NextResponse.json(
            { error: "Failed to create account", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
