import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const Experience = sequelize.define(
  "Experience",
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
    type: {
      type: DataTypes.ENUM(
        "WORK",
        "INTERNSHIP",
        "PROJECT",
        "VOLUNTEERING",
        "OTHER",
      ),
      defaultValue: "WORK",
      allowNull: false,
    },
    organisation: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "end_date",
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: "is_current",
    },
  },
  {
    tableName: "experiences",
    timestamps: true,
  },
);

export default Experience;
