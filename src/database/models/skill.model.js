import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const Skill = sequelize.define(
  "Skill",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "skills",
    timestamps: true,
  },
);

export default Skill;
