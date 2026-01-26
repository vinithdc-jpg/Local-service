import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbConnect";
import cloudinary from "@/app/lib/cloudinary";
import workerModel from "@/models/workerModel";

export async function POST(request) {
  try {
    await connectDB();

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

    console.log("Starting Cloudinary upload for:", formData.get("displayName"));
    console.log("File type:", file.type, "Size:", bytes.byteLength);

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

    console.log("Cloudinary upload successful:", uploadResult.secure_url);

    // Save in MongoDB
    const worker = await workerModel.create({
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
