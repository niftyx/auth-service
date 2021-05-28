import { FastifyReply, FastifyRequest } from "fastify";

export const handler = async function handler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { body } = request;
  const { address, message } = body as any;
  reply.code(200).send("GREAT!");
};
