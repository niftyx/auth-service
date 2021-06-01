import { doMigrations } from "../shared/migration";
import { FastifyInstance } from "fastify";
import { Server } from "http";
import cors from "fastify-cors";
import fastifyFormBody from "fastify-formbody";
import cookie from "fastify-cookie";

import routes from "../routes";
import { APPLICATION, COOKIES } from "../shared/config";
import { logger } from "../logger";
import { errors } from "../middleware/error_handling";
import { HttpServiceConfig } from "../types";

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
  config: HttpServiceConfig,
  app: FastifyInstance
): Promise<void> {
  await doMigrations();

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
  app.register(require("fastify-rate-limit"), {
    max: APPLICATION.MAX_REQUESTS,
    timeWindow: APPLICATION.TIME_FRAME,
    addHeaders: true,
    skipOnError: ({ path }: any) => {
      if (path === "/") return true;
      return false;
    },
  });
  app.register(routes);

  app.server.on("close", () => {
    logger.info("http server shutdown");
  });
  app.server.on("listening", () => {
    logger.info(`server listening on ${config.httpPort}`);
  });

  app.setErrorHandler(errors as any);

  app.server.on("error", (err) => {
    logger.error(err);
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

  app.listen(config.httpPort);
}
