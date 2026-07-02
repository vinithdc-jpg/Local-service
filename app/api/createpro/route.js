import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbConnect";
import cloudinary from "@/app/lib/cloudinary";
import workerModel from "@/models/workerModel";

export async function POST(request) {
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
    const jwt = require("jsonwebtoken");
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

    // Enforce one worker account per user.
    const existingWorker = await workerModel.findOne({ userId: decoded.userId });
    if (existingWorker) {
      return NextResponse.json(
        {
          error: "You already have a worker profile. One account can only create one worker profile.",
          worker: existingWorker,
        },
        { status: 409 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream (more robust for App Router)
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "workers",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Stream Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    // Save in MongoDB with userId
    const worker = await workerModel.create({
      userId: decoded.userId, // Link worker to authenticated user
      displayName: formData.get("displayName"),
      role: formData.get("role"),
      location: formData.get("location"),
      hourlyRate: formData.get("hourlyRate"),
      aboutService: formData.get("aboutService"),
      image: uploadResult.secure_url,
    });

    console.log("Worker saved in MongoDB:", worker._id);

    return NextResponse.json(
      { message: "Worker created", worker },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error [createpro]:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
        cloudinary_error: error.http_code || error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    // Extract role query parameter
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    // Build query object
    let query = {};
    if (role && role !== 'all') {
      // Case-insensitive role matching
      query.role = { $regex: new RegExp(`^${role}$`, 'i') };
    }

    const workers = await workerModel.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: workers.length,
        workers,
        filters: { role: role || 'all' }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [get workers]:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch workers",
        details: error.message,
      },
      { status: 500 }
    );
  }
}