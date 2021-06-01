import { FastifyReply, FastifyRequest } from "fastify";
import { JSONWebKeySet } from "jose";
import { getJwkStore } from "../../../shared/jwt";

export const handler = async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  let jwks: JSONWebKeySet;
  try {
    jwks = getJwkStore().toJWKS(false);
  } catch (err) {
    throw { code: 404, message: err.message };
  }
  return jwks;
};
