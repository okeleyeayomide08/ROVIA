import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const Education = sequelize.define(
  "Education",
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
    institution: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fieldOfStudy: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "field_of_study",
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
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    verificationStatus: {
      type: DataTypes.ENUM("PENDING", "VERIFIED", "REJECTED"),
      defaultValue: "PENDING",
      allowNull: false,
      field: "verification_status",
    },
  },
  {
    tableName: "education",
    timestamps: true,
  },
);

export default Education;
