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

export interface AppDependencies {}

/**
 * Instantiates dependencies required to run the app. Uses default settings based on config
 */
export async function getDefaultAppDependenciesAsync(
  _config: HttpServiceConfig
): Promise<AppDependencies> {
  return {};
}
/**
 * starts the app with dependencies injected.
 * @return the app object
 */
export async function getAppAsync(
  dependencies: AppDependencies,
  config: HttpServiceConfig
): Promise<{ app: FastifyInstance }> {
  const app = fastify({
    keepAliveTimeout: config.httpKeepAliveTimeout,
    logger,
  });
  await runHttpServiceAsync(dependencies, config, app);

  return { app };
}
