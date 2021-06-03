import { migrate } from "postgres-migrations";
import { Client } from "pg";

import { logger } from "../logger";
import { POSTGRES_URI } from "../config";

export const doMigrations = async () => {
  logger.info("===start Migration===");
  const dbConfig = {
    connectionString: POSTGRES_URI,
  };
  const client = new Client(dbConfig);
  try {
    await client.connect();
    await migrate({ client }, "./migrations");
    logger.info("===Migration is done successfully!===");
  } catch (e) {
    console.error(e);
    logger.error(`Error attempting to migrate, [${JSON.stringify(e)}]`);
  } finally {
    await client.end();
  }
};
