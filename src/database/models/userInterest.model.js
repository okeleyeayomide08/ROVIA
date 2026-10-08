import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const UserInterest = sequelize.define(
  "UserInterest",
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
    interestId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "interest_id",
    },
  },
  {
    tableName: "user_interests",
    timestamps: true,
  },
);

export default UserInterest;
