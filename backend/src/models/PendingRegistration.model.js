import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 70,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationTokenHash: {
      type: String,
      required: true,
      index: true,
    },
    verificationCodeHash: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // MongoDB TTL index: automatically deletes document when expiresAt timestamp is reached
      expires: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const PendingRegistration = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema
);
