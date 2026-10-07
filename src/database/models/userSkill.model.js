import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const UserSkill = sequelize.define(
  "UserSkill",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
    skillId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "skill_id",
    },
    proficiency: {
      type: DataTypes.ENUM("BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"),
      defaultValue: "BEGINNER",
      allowNull: false,
    },
    evidence: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "user_skills",
    timestamps: true,
  },
);

export default UserSkill;
