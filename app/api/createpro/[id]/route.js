import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbConnect";
import workerModel from "@/models/workerModel";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const worker = await workerModel.findById(id);

    if (!worker) {
      return NextResponse.json(
        { success: false, error: "Worker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, worker },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [get worker]:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch worker",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
