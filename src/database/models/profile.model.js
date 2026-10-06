import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const Profile = sequelize.define(
  "Profile",
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
      unique: true,
      field: "user_id",
    },
    headline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    careerLevel: {
      type: DataTypes.ENUM(
        "STUDENT",
        "ENTRY_LEVEL",
        "MID_LEVEL",
        "SENIOR",
        "EXECUTIVE",
      ),
      defaultValue: "ENTRY_LEVEL",
      allowNull: false,
      field: "career_level",
    },
    biography: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ccompletionStatus: {
      type: DataTypes.ENUM("INCOMPLETE", "COMPLETE"),
      defaultValue: "INCOMPLETE",
      allowNull: false,
      field: "completion_status",
    },
  },
  {
    tableName: "profiles",
    timestamps: true,
  },
);

export default Profile;
