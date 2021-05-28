import { FastifyInstance } from "fastify";
import { connectSchema } from "./schemas/connect";
import { handler as connectHandler } from "./handlers/connect";

const index = async (app: FastifyInstance) => {
  app.route({
    method: "POST",
    url: "/connect",
    schema: connectSchema,
    handler: connectHandler,
  });
};

export default index;
