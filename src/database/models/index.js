import sequelize from "../../config/sequelize.js";
import User from "./user.model.js";
import Profile from "./profile.model.js";
import RefreshToken from "./refreshToken.model.js";

// Define Relationships / Associations
User.hasOne(Profile, {
  foreignKey: "userId",
  as: "profile",
  onDelete: "CASCADE",
});
Profile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE",
});
RefreshToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { sequelize, User, Profile, RefreshToken };

export default {
  sequelize,
  User,
  Profile,
  RefreshToken,
};
