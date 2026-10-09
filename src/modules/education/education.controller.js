import * as educationService from "./education.service.js";

export async function getEducations(req, res) {
  const educations = await educationService.getEducations(req.user.id);

  return res.status(200).json({
    success: true,
    data: educations,
    message: "Education records retrieved successfully",
  });
}

export async function createEducation(req, res) {
  const education = await educationService.createEducation(
    req.user.id,
    req.body,
  );

  return res.status(201).json({
    success: true,
    data: education,
    message: "Education record created successfully",
  });
}

export async function updateEducation(req, res) {
  const updated = await educationService.updateEducation(
    req.user.id,
    req.params.id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    data: updated,
    message: "Education record updated successfully",
  });
}

export async function deleteEducation(req, res) {
  await educationService.deleteEducation(req.user.id, req.params.id);

  return res.status(200).json({
    success: true,
    data: null,
    message: "Education record deleted successfully",
  });
}
