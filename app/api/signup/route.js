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
        const { username, email, password } = body;

        // Validate required fields
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate username length
        if (username.length < 3 || username.length > 30) {
            return NextResponse.json(
                { error: "Username must be between 3 and 30 characters" },
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

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });

        // Save user to database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email
            },
            process.env.JWT_SECRET || "your-secret-key-change-this",
            { expiresIn: "7d" }
        );

        // Return success response without password
        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                },
                token,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Signup error:", error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
