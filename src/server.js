import app from "./app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";
import { startCronJobs } from "./modules/home/cron.service.js";
import { checkEmailConfig } from "./utils/email.js";

const server = app.listen(env.port, () => {
  logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  checkEmailConfig();
  startCronJobs();
});

export default server;
