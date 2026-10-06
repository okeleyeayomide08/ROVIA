import logger from "../config/logger.js";
import ApiError from "../utils/ApiError.js";

function errorHandler(err, req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.fields && { fields: err.fields }),
      },
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    const fields = {};
    err.errors.forEach((e) => {
      fields[e.path] = [`${e.path} already exists`];
    });

    return res.status(409).json({
      success: false,
      error: {
        code: "CONFLICT",
        message: "A record with this data already exists",
        fields,
      },
    });
  }

  if (err.name === "SequelizeValidationError") {
    const fields = {};
    err.errors.forEach((e) => {
      fields[e.path] = [e.message];
    });

    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Database validation failed",
        fields,
      },
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid authentication token",
      },
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication token has expired",
      },
    });
  }

  logger.error({ err, requestId: req.id }, "Unhandled error");

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : err.message,
    },
  });
}

export default errorHandler;
