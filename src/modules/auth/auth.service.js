import { Op } from "sequelize";
import {
  sequelize,
  User,
  Profile,
  RefreshToken,
} from "../../database/models/index.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../../utils/tokens.js";
import ApiError from "../../utils/ApiError.js";

export async function register({ email, password }) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(
      409,
      "CONFLICT",
      "An account with this email already exists",
    );
  }

  const passwordHash = await hashPassword(password);

  const result = await sequelize.transaction(async (t) => {
    const user = await User.create(
      {
        email,
        passwordHash,
      },
      { transaction: t },
    );

    const profile = await Profile.create(
      {
        userId: user.id,
      },
      { transaction: t },
    );

    return { user, profile };
  });

  const payload = { id: result.user.id, email: result.user.email };
  const accessToken = generateAccessToken(payload);
  const rawRefreshToken = generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId: result.user.id,
    tokenHash: hashToken(rawRefreshToken),
    expiresAt,
  });

  const userJson = result.user.toJSON();
  delete userJson.passwordHash;

  return {
    user: userJson,
    accessToken,
    refreshToken: rawRefreshToken,
  };
}

export async function login({ email, password }) {
  const user = await User.scope("withPassword").findOne({ where: { email } });

  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "Invalid email or password");
  }

  if (user.accountStatus !== "ACTIVE") {
    throw new ApiError(
      401,
      "UNAUTHORIZED",
      "Account is suspended or deactivated",
    );
  }

  const isValidPassword = await verifyPassword(user.passwordHash, password);
  if (!isValidPassword) {
    throw new ApiError(401, "UNAUTHORIZED", "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const payload = { id: user.id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const rawRefreshToken = generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(rawRefreshToken),
    expiresAt,
  });

  const userJson = user.toJSON();
  delete userJson.passwordHash;

  return {
    user: userJson,
    accessToken,
    refreshToken: rawRefreshToken,
  };
}

export async function refresh(rawRefreshToken) {
  if (!rawRefreshToken) {
    throw new ApiError(401, "UNAUTHORIZED", "Refresh token is required");
  }

  const tokenHash = hashToken(rawRefreshToken);

  const storedToken = await RefreshToken.findOne({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: {
        [Op.gt]: new Date(),
      },
    },
    include: [{ model: User, as: "user" }],
  });

  if (!storedToken || !storedToken.user) {
    throw new ApiError(401, "UNAUTHORIZED", "Invalid or expired refresh token");
  }

  if (storedToken.user.accountStatus !== "ACTIVE") {
    throw new ApiError(
      401,
      "UNAUTHORIZED",
      "Account is suspended or deactivated",
    );
  }

  const payload = { id: storedToken.user.id, email: storedToken.user.email };
  const accessToken = generateAccessToken(payload);

  return { accessToken };
}

export async function logout(rawRefreshToken) {
  if (!rawRefreshToken) return;

  const tokenHash = hashToken(rawRefreshToken);

  await RefreshToken.update(
    { revokedAt: new Date() },
    {
      where: {
        tokenHash,
        revokedAt: null,
      },
    },
  );
}
