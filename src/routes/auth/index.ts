import { FastifyInstance } from "fastify";
import { connectSchema } from "./schemas/connect";
import { handler as connectHandler } from "./handlers/connect";
import { handler as jwksHandler } from "./handlers/jwks";

const index = async (app: FastifyInstance) => {
  app.route({
    method: "POST",
    url: "/connect",
    schema: connectSchema,
    handler: connectHandler,
  });

  app.route({
    method: "GET",
    url: "/jwks",
    handler: jwksHandler,
  });
};

export default index;
