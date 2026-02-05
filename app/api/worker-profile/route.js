import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbConnect";
import workerModel from "@/models/workerModel";
import jwt from "jsonwebtoken";

// Get worker profile by userId
export async function GET(request) {
    try {
        await connectDB();

        // Get token from Authorization header
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Authentication required. Please login." },
                { status: 401 }
            );
        }

        // Extract and verify token
        const token = authHeader.substring(7);
        let decoded;
        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "your-secret-key-change-this"
            );
        } catch (err) {
            return NextResponse.json(
                { error: "Invalid or expired token. Please login again." },
                { status: 401 }
            );
        }

        // Find worker profile by userId
        const worker = await workerModel.findOne({ userId: decoded.userId });

        if (!worker) {
            return NextResponse.json(
                { error: "No worker profile found", hasProfile: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                hasProfile: true,
                worker,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("API Error [get worker profile]:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch worker profile",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
