import * as goalService from "./goal.service.js";

export async function getGoals(req, res) {
  const goals = await goalService.getGoals(req.user.id);

  return res.status(200).json({
    success: true,
    data: goals,
    message: "Career goals retrieved successfully",
  });
}

export async function createGoal(req, res) {
  const goal = await goalService.createGoal(req.user.id, req.body);

  return res.status(201).json({
    success: true,
    data: goal,
    message: "Career goal created successfully",
  });
}

export async function updateGoal(req, res) {
  const updated = await goalService.updateGoal(
    req.user.id,
    req.params.id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    data: updated,
    message: "Career goal updated successfully",
  });
}

export async function deleteGoal(req, res) {
  await goalService.deleteGoal(req.user.id, req.params.id);

  return res.status(200).json({
    success: true,
    data: null,
    message: "Career goal deleted successfully",
  });
}
