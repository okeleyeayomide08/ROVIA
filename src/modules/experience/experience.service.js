import { Experience } from "../../database/models/index.js";
import ApiError from "../../utils/ApiError.js";

/**
 * List all experiences for the authenticated user
 */
export async function getExperiences(userId) {
  return Experience.findAll({
    where: { userId },
    order: [
      ["isCurrent", "DESC"],
      ["startDate", "DESC NULLS LAST"],
    ],
  });
}

/**
 * Create a new experience record
 */
export async function createExperience(userId, data) {
  // Business rule: if isCurrent, endDate must be null
  if (data.isCurrent === true && data.endDate) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "Current experience cannot have an end date",
    );
  }

  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "End date cannot be earlier than start date",
    );
  }

  return Experience.create({
    ...data,
    userId,
  });
}

/**
 * Update an experience record (with ownership check)
 */
export async function updateExperience(userId, id, updateData) {
  const experience = await Experience.findOne({
    where: { id, userId },
  });

  if (!experience) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Experience record not found or does not belong to you",
    );
  }

  const isCurrent =
    updateData.isCurrent !== undefined
      ? updateData.isCurrent
      : experience.isCurrent;
  const endDate =
    updateData.endDate !== undefined ? updateData.endDate : experience.endDate;
  const startDate = updateData.startDate || experience.startDate;

  if (isCurrent === true && endDate) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "Current experience cannot have an end date",
    );
  }

  if (startDate && endDate && endDate < startDate) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "End date cannot be earlier than start date",
    );
  }

  return experience.update(updateData);
}

/**
 * Delete an experience record (with ownership check)
 */
export async function deleteExperience(userId, id) {
  const experience = await Experience.findOne({
    where: { id, userId },
  });

  if (!experience) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Experience record not found or does not belong to you",
    );
  }

  await experience.destroy();
}
