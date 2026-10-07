import * as profileService from "./profile.service.js";

export async function getProfile(req, res) {
  const result = await profileService.getProfileByUserId(req.user.id);

  return res.status(200).json({
    success: true,
    data: result,
    message: "Profile retrieved successfully",
  });
}

export async function updateProfile(req, res) {
  const updatedProfile = await profileService.updateProfile(
    req.user.id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    data: updatedProfile,
    message: "Profile updated successfully",
  });
}
