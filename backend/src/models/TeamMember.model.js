import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Member name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Member email is required"],
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Media Buyer", "Analyst", "Viewer"],
      default: "Media Buyer",
    },
    status: {
      type: String,
      enum: ["Active", "Invited", "Suspended"],
      default: "Active",
    },
    avatar: {
      type: String,
      default: null,
    },
    lastActive: {
      type: String,
      default: "Just now",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
