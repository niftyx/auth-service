import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const index = async (app: FastifyInstance) => {
  app.route({
    method: "GET",
    url: "/",
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      reply.code(200).send("OK");
    },
  });
};

export default index;
