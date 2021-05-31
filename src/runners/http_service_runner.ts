import { doMigrations } from "../shared/migration";
import { FastifyInstance } from "fastify";
import { Server } from "http";

import { AppDependencies } from "../app";
import { logger } from "../logger";
import { errors } from "../middleware/error_handling";
import { HttpServiceConfig } from "../types";

import { createDefaultServer } from "./utils";

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  if (err) {
    logger.error(err);
  }
});

export interface HttpServices {
  server: Server;
}

/**
 * This service handles the HTTP requests. This involves fetching from the database
 */
export async function runHttpServiceAsync(
  dependencies: AppDependencies,
  config: HttpServiceConfig,
  app: FastifyInstance
): Promise<void> {
  await doMigrations();

  createDefaultServer(dependencies, config, app);

  app.setErrorHandler(errors as any);

  app.server.on("error", (err) => {
    logger.error(err);
  });

  app.listen(config.httpPort);
}
