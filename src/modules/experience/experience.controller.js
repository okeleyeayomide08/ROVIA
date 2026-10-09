import * as experienceService from "./experience.service.js";

export async function getExperiences(req, res) {
  const experiences = await experienceService.getExperiences(req.user.id);

  return res.status(200).json({
    success: true,
    data: experiences,
    message: "Experiences retrieved successfully",
  });
}

export async function createExperience(req, res) {
  const experience = await experienceService.createExperience(
    req.user.id,
    req.body,
  );

  return res.status(201).json({
    success: true,
    data: experience,
    message: "Experience created successfully",
  });
}

export async function updateExperience(req, res) {
  const updated = await experienceService.updateExperience(
    req.user.id,
    req.params.id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    data: updated,
    message: "Experience updated successfully",
  });
}

export async function deleteExperience(req, res) {
  await experienceService.deleteExperience(req.user.id, req.params.id);

  return res.status(200).json({
    success: true,
    data: null,
    message: "Experience deleted successfully",
  });
}
