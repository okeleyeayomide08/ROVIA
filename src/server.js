import app from "./app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";

const server = app.listen(env.port, () => {
  logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
});

export default server;
