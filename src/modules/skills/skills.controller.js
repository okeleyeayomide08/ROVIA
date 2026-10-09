import * as skillsService from "./skills.service.js";

export async function getAllSkills(req, res) {
  const skills = await skillsService.getAllSkills(req.query.query);

  return res.status(200).json({
    success: true,
    data: skills,
    message: "Skills catalog retrieved successfully",
  });
}

export async function getUserSkills(req, res) {
  const skills = await skillsService.getUserSkills(req.user.id);

  return res.status(200).json({
    success: true,
    data: skills,
    message: "User skills retrieved successfully",
  });
}

export async function addUserSkill(req, res) {
  const skill = await skillsService.addUserSkill(req.user.id, req.body);

  return res.status(201).json({
    success: true,
    data: skill,
    message: "Skill added successfully",
  });
}

export async function updateUserSkill(req, res) {
  const updated = await skillsService.updateUserSkill(
    req.user.id,
    req.params.skillId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    data: updated,
    message: "Skill updated successfully",
  });
}

export async function removeUserSkill(req, res) {
  await skillsService.removeUserSkill(req.user.id, req.params.skillId);

  return res.status(200).json({
    success: true,
    data: null,
    message: "Skill removed successfully",
  });
}
