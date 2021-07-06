import fastify, { FastifyInstance } from "fastify";
import cors from "fastify-cors";

import { APPLICATION } from "./shared/config";

import { errors } from "./middleware/error_handling";
import { HttpServiceConfig } from "./types";
import { logger } from "./logger";
import apollo from "./apollo";
import mercurius from "mercurius";
import { MODE } from "./config";
import { doMigrations } from "./shared/migration";

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  if (err) {
    logger.error(err);
  }
});

/**
 * @return the app object
 */
export async function getAppAsync(
  config: HttpServiceConfig
): Promise<{ app: FastifyInstance }> {
  await doMigrations();

  const app = fastify({
    logger,
  });

  app.register(cors, {
    origin: (origin, cb) => {
      if (MODE === "production") {
        // PRODUCTION
        if (/localhost/.test(origin)) {
          // REJECT REQUESTS FROM LOCALHOST
          cb(new Error("Not allowed"), false);
          return;
        }
      }

      cb(null, true);
    },
  });

  app.register(require("fastify-rate-limit"), {
    max: APPLICATION.MAX_REQUESTS,
    timeWindow: APPLICATION.TIME_FRAME,
    addHeaders: true,
    skipOnError: ({ path }: any) => {
      // disable rateLimit for health check
      if (path === "/") return true;
      return false;
    },
  });

  app.register(mercurius, { ...apollo, graphiql: "playground" });

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

  return { app };
}
