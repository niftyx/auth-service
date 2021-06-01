import fastify, { FastifyInstance } from "fastify";

import { LOGGER_INCLUDE_TIMESTAMP, LOG_LEVEL } from "./config";

import { runHttpServiceAsync } from "./runners/http_service_runner";
import { HttpServiceConfig } from "./types";
import pino from "pino";

export const logger = pino({
  level: LOG_LEVEL,
  useLevelLabels: true,
  timestamp: LOGGER_INCLUDE_TIMESTAMP,
});

/**
 * @return the app object
 */
export async function getAppAsync(
  config: HttpServiceConfig
): Promise<{ app: FastifyInstance }> {
  const app = fastify({
    keepAliveTimeout: config.httpKeepAliveTimeout,
    logger,
  });
  await runHttpServiceAsync(config, app);
  return { app };
}
