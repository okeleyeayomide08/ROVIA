import { validationResult } from "express-validator";

function validate(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const fields = {};

  for (const error of errors.array()) {
    if (!fields[error.path]) {
      fields[error.path] = [];
    }
    fields[error.path].push(error.msg);
  }

  return res.status(400).json({
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "The submitted information is invalid",
      fields,
    },
  });
}

export default validate;
