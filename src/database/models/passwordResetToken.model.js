import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const PasswordResetToken = sequelize.define(
  "PasswordResetToken",
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
    tokenHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "token_hash",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "used_at",
    },
  },
  {
    tableName: "password_reset_tokens",
    timestamps: true,
  },
);

export default PasswordResetToken;
