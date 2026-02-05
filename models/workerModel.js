import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user can only create one worker profile
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },

    aboutService: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    image: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Worker || mongoose.model("Worker", workerSchema);
