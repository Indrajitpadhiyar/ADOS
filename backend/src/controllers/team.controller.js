import { TeamMember } from "../models/TeamMember.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const TeamController = {
  /**
   * GET /api/v1/team
   * List team members
   */
  getTeam: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const team = await TeamMember.find({ userId }).sort({ createdAt: 1 });
    return ApiResponse.success(res, "Team members retrieved successfully", team);
  }),

  /**
   * POST /api/v1/team
   * Invite a new team member
   */
  inviteMember: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { name, email, role = "Media Buyer" } = req.body;

    if (!name || !email) {
      throw ApiError.badRequest("Member name and email are required.");
    }

    const existingMember = await TeamMember.findOne({ userId, email: email.toLowerCase().trim() });
    if (existingMember) {
      throw ApiError.conflict("A team member with this email address already exists.");
    }

    const member = await TeamMember.create({
      userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      status: "Invited",
      lastActive: "Pending Invite",
    });

    return ApiResponse.created(res, "Team invitation sent successfully!", member);
  }),

  /**
   * PATCH /api/v1/team/:id
   * Update member role / status
   */
  updateMember: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const member = await TeamMember.findOneAndUpdate(
      { _id: id, userId },
      { $set: req.body },
      { new: true }
    );

    if (!member) {
      throw ApiError.notFound("Team member not found.");
    }

    return ApiResponse.success(res, "Team member updated successfully", member);
  }),

  /**
   * DELETE /api/v1/team/:id
   * Remove member
   */
  removeMember: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const member = await TeamMember.findOneAndDelete({ _id: id, userId });
    if (!member) {
      throw ApiError.notFound("Team member not found.");
    }

    return ApiResponse.success(res, "Team member removed successfully", { id });
  }),
};
