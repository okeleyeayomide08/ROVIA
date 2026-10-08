import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const CareerGoal = sequelize.define(
  "CareerGoal",
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
    goalType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "goal_type",
    },
    targetRole: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "target_role",
    },
    targetIndustry: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "target_industry",
    },
    targetLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "target_location",
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
      defaultValue: "MEDIUM",
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "ACHIEVED", "ABANDONED"),
      defaultValue: "ACTIVE",
      allowNull: false,
    },
  },
  {
    tableName: "career_goals",
    timestamps: true,
  },
);

export default CareerGoal;
