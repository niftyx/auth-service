import { getAppAsync } from "./app";
import { defaultHttpServiceWithRateLimiterConfig } from "./config";
import { logger } from "./logger";

if (require.main === module) {
  (async () => {
    await getAppAsync(defaultHttpServiceWithRateLimiterConfig);
  })().catch((err) => logger.error(err.stack));
}
process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  if (err) {
    logger.error(err);
  }
});
