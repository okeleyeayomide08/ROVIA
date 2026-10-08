import * as certificationService from "./certification.service.js";

export async function getCertifications(req, res) {
  const certifications = await certificationService.getCertifications(
    req.user.id,
  );

  return res.status(200).json({
    success: true,
    data: certifications,
    message: "Certifications retrieved successfully",
  });
}

export async function createCertification(req, res) {
  const certification = await certificationService.createCertification(
    req.user.id,
    req.body,
  );

  return res.status(201).json({
    success: true,
    data: certification,
    message: "Certification created successfully",
  });
}

export async function updateCertification(req, res) {
  const updated = await certificationService.updateCertification(
    req.user.id,
    req.params.id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    data: updated,
    message: "Certification updated successfully",
  });
}

export async function deleteCertification(req, res) {
  await certificationService.deleteCertification(req.user.id, req.params.id);

  return res.status(200).json({
    success: true,
    data: null,
    message: "Certification deleted successfully",
  });
}
