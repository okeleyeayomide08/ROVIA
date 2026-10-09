import { Education } from "../../database/models/index.js";
import ApiError from "../../utils/ApiError.js";

/**
 * List all education records for the authenticated user
 */
export async function getEducations(userId) {
  return Education.findAll({
    where: { userId },
    order: [["startDate", "DESC NULLS LAST"]],
  });
}

/**
 * Create a new education record
 */
export async function createEducation(userId, data) {
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "End date cannot be earlier than start date",
    );
  }

  return Education.create({
    ...data,
    userId,
  });
}

/**
 * Update an education record (with ownership check)
 */
export async function updateEducation(userId, id, updateData) {
  const education = await Education.findOne({
    where: { id, userId },
  });

  if (!education) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Education record not found or does not belong to you",
    );
  }

  const startDate = updateData.startDate || education.startDate;
  const endDate =
    updateData.endDate !== undefined ? updateData.endDate : education.endDate;

  if (startDate && endDate && endDate < startDate) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "End date cannot be earlier than start date",
    );
  }

  return education.update(updateData);
}

/**
 * Delete an education record (with ownership check)
 */
export async function deleteEducation(userId, id) {
  const education = await Education.findOne({
    where: { id, userId },
  });

  if (!education) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Education record not found or does not belong to you",
    );
  }

  await education.destroy();
}
