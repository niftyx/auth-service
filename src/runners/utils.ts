import { FastifyInstance } from "fastify";
import cors from "fastify-cors";
import fastifyFormBody from "fastify-formbody";
import cookie from "fastify-cookie";
import { AppDependencies } from "../app";
import { logger } from "../logger";
import { HttpServiceConfig } from "../types";

import routes from "../routes";
import { COOKIES } from "../shared/config";

/**
 * creates the NodeJS http server with graceful shutdowns, healthchecks,
 * configured header timeouts and other sane defaults set.
 */
export function createDefaultServer(
  _dependencies: AppDependencies,
  config: HttpServiceConfig,
  app: FastifyInstance
) {
  app.register(cors, {});
  app.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    function (req, body, done) {
      try {
        var json = JSON.parse(body as any);
        done(null, json);
      } catch (err) {
        err.statusCode = 400;
        done(err, undefined);
      }
    }
  );
  app.register(fastifyFormBody);
  app.register(cookie, {
    secret: COOKIES.SECRET,
  });
  app.register(routes);

  app.server.on("close", () => {
    logger.info("http server shutdown");
  });
  app.server.on("listening", () => {
    logger.info(`server listening on ${config.httpPort}`);
  });

  const shutdownFunc = (sig: string) => {
    logger.info(`received: ${sig}, shutting down server`);
    app.server.close(async (err) => {
      if (!app.server.listening) {
        process.exit(0);
      }
      if (err) {
        logger.error(`server closed with an error: ${err}, exiting`);
        process.exit(1);
      }
      logger.info("successful shutdown, exiting");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdownFunc);
  process.on("SIGTERM", shutdownFunc);
  process.on("SIGQUIT", shutdownFunc);
}
