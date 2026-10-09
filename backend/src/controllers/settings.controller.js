import { Settings } from "../models/Settings.model.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";

export const SettingsController = {
  /**
   * GET /api/v1/settings
   * Retrieve user preferences and API key
   */
  getSettings: asyncHandler(async (req, res) => {
    const userId = req.user._id;

    let settings = await Settings.findOne({ userId });
    if (!settings) {
      settings = await Settings.create({
        userId,
        attributionModel: "data_driven",
        refreshRate: "14ms",
        webhookUrl: "https://api.brand.com/v1/ados-webhooks",
        minRoasAlert: 2.8,
        autoPauseFatigue: true,
        emailAlerts: true,
        slackAlerts: true,
      });
    }

    return ApiResponse.success(res, "Settings retrieved successfully", settings);
  }),

  /**
   * PUT /api/v1/settings
   * Update preferences
   */
  updateSettings: asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const {
      attributionModel,
      refreshRate,
      webhookUrl,
      minRoasAlert,
      autoPauseFatigue,
      emailAlerts,
      slackAlerts,
      name,
      company,
      timezone,
      currency,
    } = req.body;

    // Update settings model
    const settings = await Settings.findOneAndUpdate(
      { userId },
      {
        $set: {
          attributionModel,
          refreshRate,
          webhookUrl,
          minRoasAlert,
          autoPauseFatigue,
          emailAlerts,
          slackAlerts,
        },
      },
      { new: true, upsert: true }
    );

    // If profile info passed, update User as well
    if (name || company || timezone || currency) {
      await User.findByIdAndUpdate(userId, {
        $set: {
          ...(name && { name: name.trim() }),
          ...(company !== undefined && { company: company.trim() }),
          ...(timezone && { timezone }),
          ...(currency && { currency }),
        },
      });
    }

    return ApiResponse.success(res, "Preferences saved successfully", settings);
  }),

  /**
   * POST /api/v1/settings/regenerate-api-key
   * Rotate and return new high-entropy live API key
   */
  regenerateApiKey: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const newApiKey = `ados_live_sec_${crypto.randomBytes(16).toString("hex")}`;

    const settings = await Settings.findOneAndUpdate(
      { userId },
      { $set: { apiKey: newApiKey } },
      { new: true, upsert: true }
    );

    return ApiResponse.success(res, "API key regenerated successfully", {
      apiKey: settings.apiKey,
    });
  }),
};
