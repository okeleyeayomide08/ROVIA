import sequelize from "../../config/sequelize.js";
import User from "./user.model.js";
import Profile from "./profile.model.js";
import RefreshToken from "./refreshToken.model.js";
import PasswordResetToken from "./passwordResetToken.model.js";
import Education from "./education.model.js";
import Skill from "./skill.model.js";
import UserSkill from "./userSkill.model.js";

// ==========================================
// User & Profile (1:1)
// ==========================================
User.hasOne(Profile, {
  foreignKey: "userId",
  as: "profile",
  onDelete: "CASCADE",
});
Profile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ==========================================
// User & RefreshTokens (1:N)
// ==========================================
User.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE",
});
RefreshToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ==========================================
// User & PasswordResetTokens (1:N)
// ==========================================
User.hasMany(PasswordResetToken, {
  foreignKey: "userId",
  as: "passwordResetTokens",
  onDelete: "CASCADE",
});
PasswordResetToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ==========================================
// User & Education (1:N)
// ==========================================
User.hasMany(Education, {
  foreignKey: "userId",
  as: "education",
  onDelete: "CASCADE",
});
Education.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ==========================================
// User & Skills (N:M through UserSkill)
// ==========================================
User.belongsToMany(Skill, {
  through: UserSkill,
  foreignKey: "userId",
  otherKey: "skillId",
  as: "skills",
});
Skill.belongsToMany(User, {
  through: UserSkill,
  foreignKey: "skillId",
  otherKey: "userId",
  as: "users",
});

UserSkill.belongsTo(User, { foreignKey: "userId", as: "user" });
UserSkill.belongsTo(Skill, { foreignKey: "skillId", as: "skill" });
User.hasMany(UserSkill, { foreignKey: "userId", as: "userSkills" });
Skill.hasMany(UserSkill, { foreignKey: "skillId", as: "userSkills" });

// ==========================================
// Exports
// ==========================================
export {
  sequelize,
  User,
  Profile,
  RefreshToken,
  PasswordResetToken,
  Education,
  Skill,
  UserSkill,
};

export default {
  sequelize,
  User,
  Profile,
  RefreshToken,
  PasswordResetToken,
  Education,
  Skill,
  UserSkill,
};
