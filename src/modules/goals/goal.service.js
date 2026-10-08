import { CareerGoal } from "../../database/models/index.js";
import ApiError from "../../utils/ApiError.js";

/**
 * Get all career goals for a user
 */
export async function getGoals(userId) {
  return CareerGoal.findAll({
    where: { userId },
    order: [
      ["status", "ASC"], // ACTIVE goals first
      ["createdAt", "DESC"],
    ],
  });
}

/**
 * Create a new career goal
 */
export async function createGoal(userId, data) {
  return CareerGoal.create({
    ...data,
    userId,
  });
}

/**
 * Update an existing goal (with ownership check)
 */
export async function updateGoal(userId, id, updateData) {
  const goal = await CareerGoal.findOne({
    where: { id, userId },
  });

  if (!goal) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Career goal not found or does not belong to you",
    );
  }

  return goal.update(updateData);
}

/**
 * Delete a goal (with ownership check)
 */
export async function deleteGoal(userId, id) {
  const goal = await CareerGoal.findOne({
    where: { id, userId },
  });

  if (!goal) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Career goal not found or does not belong to you",
    );
  }

  await goal.destroy();
}
