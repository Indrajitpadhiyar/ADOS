import mongoose from "mongoose";
import crypto from "crypto";

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    attributionModel: {
      type: String,
      default: "data_driven",
    },
    refreshRate: {
      type: String,
      default: "14ms",
    },
    webhookUrl: {
      type: String,
      default: "https://api.brand.com/v1/ados-webhooks",
    },
    minRoasAlert: {
      type: Number,
      default: 2.8,
    },
    autoPauseFatigue: {
      type: Boolean,
      default: true,
    },
    emailAlerts: {
      type: Boolean,
      default: true,
    },
    slackAlerts: {
      type: Boolean,
      default: true,
    },
    apiKey: {
      type: String,
      default: () => `ados_live_sec_${crypto.randomBytes(16).toString("hex")}`,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Settings = mongoose.model("Settings", settingsSchema);
