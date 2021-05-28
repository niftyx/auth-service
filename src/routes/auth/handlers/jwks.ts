import { NowRequestHandler } from "fastify-now";

export const GET: NowRequestHandler = async (req, rep) => {
  return "jwks is working now";
};
