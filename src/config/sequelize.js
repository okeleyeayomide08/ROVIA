import { Sequelize } from "sequelize";
import env from "./env.js";
import logger from "./logger.js";

const sequelize = new Sequelize(env.databaseUrl, {
  dialect: "postgres",
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
    timestamps: true,
  },
});

export default sequelize;
