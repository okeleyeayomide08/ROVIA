import ApiError from "../utils/ApiError.js";

function notFound(req, res, next) {
  next(new ApiError(404, "NOT_FOUND", `Route ${req.originalUrl} not found`));
}

export default notFound;
