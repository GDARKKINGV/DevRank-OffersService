import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const offerSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    location: {
      country: String,
      city: String,
    },
    level: {
      type: String,
      enum: ["senior", "junior", "mid"],
      required: true,
    },
    skills: [skillSchema],
    description: {
      type: String,
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Developer",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Offer", offerSchema);
