import { Certification } from "../../database/models/index.js";
import ApiError from "../../utils/ApiError.js";

/**
 * List all certifications for the authenticated user
 */
export async function getCertifications(userId) {
  return Certification.findAll({
    where: { userId },
    order: [["issueDate", "DESC NULLS LAST"]],
  });
}

/**
 * Create a new certification
 */
export async function createCertification(userId, data) {
  // Business rule: if both dates exist, expiry cannot be before issue date
  if (data.issueDate && data.expiryDate && data.expiryDate < data.issueDate) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "Expiry date cannot be earlier than issue date",
    );
  }

  return Certification.create({
    ...data,
    userId,
  });
}

/**
 * Update an existing certification (with strict ownership check)
 */
export async function updateCertification(userId, id, updateData) {
  const certification = await Certification.findOne({
    where: { id, userId },
  });

  if (!certification) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Certification record not found or does not belong to you",
    );
  }

  const issueDate = updateData.issueDate || certification.issueDate;
  const expiryDate =
    updateData.expiryDate !== undefined
      ? updateData.expiryDate
      : certification.expiryDate;

  if (issueDate && expiryDate && expiryDate < issueDate) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "Expiry date cannot be earlier than issue date",
    );
  }

  return certification.update(updateData);
}

/**
 * Delete a certification (with strict ownership check)
 */
export async function deleteCertification(userId, id) {
  const certification = await Certification.findOne({
    where: { id, userId },
  });

  if (!certification) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Certification record not found or does not belong to you",
    );
  }

  await certification.destroy();
}
