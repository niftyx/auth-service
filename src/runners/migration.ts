import { migrate } from "postgres-migrations";
import { Client } from "pg";

import { logger } from "../logger";
import { POSTGRES_URI } from "../config";

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  if (err) {
    logger.error(err);
  }
});

if (require.main === module) {
  (async () => {
    logger.info("===start Migration===");
    const dbConfig = {
      connectionString: POSTGRES_URI,
    };
    const client = new Client(dbConfig);
    try {
      await client.connect();
      await migrate({ client }, "./migrations");
    } catch (e) {
      logger.error(`Error attempting to migrate, [${JSON.stringify(e)}]`);
    } finally {
      await client.end();
    }
  })().catch((error) => logger.error(error.stack));
}
