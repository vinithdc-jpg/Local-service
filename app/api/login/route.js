import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbConnect";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        // Connect to database
        await connectDB();

        // Parse request body
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        // Find user by email and explicitly select password field
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET || "your-secret-key-change-this",
            { expiresIn: "7d" }
        );

        // Return success response without password
        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
                token,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
