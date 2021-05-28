import { FastifyReply, FastifyRequest } from "fastify";

interface Error {
  output?: {
    payload?: Record<string, unknown>;
    statusCode?: number;
  };
  details?: [
    {
      message?: string;
    }
  ];
}

/**
 * This is a custom error middleware for Express.
 * https://expressjs.com/en/guide/error-handling.html
 */
export function errors(err: Error, req: FastifyRequest, res: FastifyReply) {
  const code = err?.output?.statusCode || 400;

  // log error
  req.log.error(err);

  /**
   * The default error message looks like this.
   */
  const error = err?.output?.payload || {
    statusCode: code,
    error: code === 400 ? "Bad Request" : "Internal Server Error",
    message: err?.details?.[0]?.message,
  };

  return res.status(code).send({ ...error });
}
