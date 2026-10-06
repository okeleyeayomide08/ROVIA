import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { User } from "../database/models/index.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication token is required");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "UNAUTHORIZED", "Malformed authorization header");
  }

  const decoded = verifyAccessToken(token);

  const userId = decoded.id || decoded.sub;
  const user = await User.findByPk(userId);

  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "User account not found");
  }

  if (user.accountStatus !== "ACTIVE") {
    throw new ApiError(
      401,
      "UNAUTHORIZED",
      "Account is suspended or deactivated",
    );
  }

  req.user = user;
  next();
});

export default authenticate;
