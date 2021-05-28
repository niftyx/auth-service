import { FastifyInstance } from "fastify";
import { AUTH_PATH } from "../constants";
import authRoutes from "./auth";
import indexRoutes from "./default";

const index = async (app: FastifyInstance) => {
  app.register(authRoutes, { prefix: AUTH_PATH });
  app.register(indexRoutes);
};

export default index;
