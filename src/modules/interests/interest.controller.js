import * as interestService from "./interest.service.js";

export async function getAllInterests(req, res) {
  const interests = await interestService.getAllInterests(req.query.query);

  return res.status(200).json({
    success: true,
    data: interests,
    message: "Interests catalog retrieved successfully",
  });
}

export async function getUserInterests(req, res) {
  const interests = await interestService.getUserInterests(req.user.id);

  return res.status(200).json({
    success: true,
    data: interests,
    message: "User interests retrieved successfully",
  });
}

export async function syncUserInterests(req, res) {
  const updatedInterests = await interestService.syncUserInterests(
    req.user.id,
    req.body.interests,
  );

  return res.status(200).json({
    success: true,
    data: updatedInterests,
    message: "User interests updated successfully",
  });
}

export async function addUserInterest(req, res) {
  const interest = await interestService.addUserInterest(
    req.user.id,
    req.body.name,
    req.body.category,
  );

  return res.status(201).json({
    success: true,
    data: interest,
    message: "Interest added successfully",
  });
}

export async function removeUserInterest(req, res) {
  await interestService.removeUserInterest(req.user.id, req.params.interestId);

  return res.status(200).json({
    success: true,
    data: null,
    message: "Interest removed successfully",
  });
}
