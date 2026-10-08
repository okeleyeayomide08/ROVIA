import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const Certification = sequelize.define(
  "Certification",
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    issuer: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "issue_date",
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "expiry_date",
    },
    credentialId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "credential_id",
    },
    credentialUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "credential_url",
    },
    verificationStatus: {
      type: DataTypes.ENUM("PENDING", "VERIFIED", "REJECTED"),
      defaultValue: "PENDING",
      allowNull: false,
      field: "verification_status",
    },
  },
  {
    tableName: "certifications",
    timestamps: true,
  },
);

export default Certification;
