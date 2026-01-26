import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token from request headers
 * Usage: Call this function at the start of protected API routes
 * 
 * @param {Request} request - Next.js request object
 * @returns {Object|NextResponse} - Returns decoded token data or error response
 */
export async function verifyAuth(request) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No token provided. Please login to access this resource." },
                { status: 401 }
            );
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your-secret-key-change-this"
        );

        // Return decoded user data
        return {
            success: true,
            userId: decoded.userId,
            email: decoded.email,
        };

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return NextResponse.json(
                { error: "Token has expired. Please login again." },
                { status: 401 }
            );
        }

        if (error.name === "JsonWebTokenError") {
            return NextResponse.json(
                { error: "Invalid token. Please login again." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Authentication failed." },
            { status: 401 }
        );
    }
}

/**
 * Example usage in a protected route:
 * 
 * import { verifyAuth } from "@/app/lib/auth";
 * 
 * export async function GET(request) {
 *   const authResult = await verifyAuth(request);
 *   
 *   // If authResult is a NextResponse, it means auth failed
 *   if (authResult instanceof NextResponse) {
 *     return authResult;
 *   }
 *   
 *   // Auth succeeded, use authResult.userId and authResult.email
 *   const userId = authResult.userId;
 *   
 *   // ... your protected route logic
 * }
 */
