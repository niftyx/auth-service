import { headers, errorSchemas } from "../../../shared/schema";

const connectResponseSchema = {
  type: "object",
  properties: {
    jwt_token: {
      type: "string",
    },
    jwt_expires_in: {
      type: "number",
    },
    refresh_token: {
      type: "string",
    },
  },
};

const connectRequestSchema = {
  tags: ["Connect"],
  summary: "This api generates jwt token",
  description: `<h3>This API let users to get jwt token</h3>`,
  headers,
  body: {
    type: "object",
    required: ["message", "signedMessage"],
    properties: {
      message: { type: "string" },
      signedMessage: { type: "string" },
    },
  },
};

export const connectSchema = {
  ...connectRequestSchema,
  response: {
    200: connectResponseSchema,
    ...errorSchemas,
  },
};
