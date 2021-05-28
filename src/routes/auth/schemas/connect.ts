import { headers, errorSchemas } from "../../../shared/schema";

const connectResponseSchema = {
  type: "object",
  properties: {
    address: {
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
    required: ["address", "message"],
    properties: {
      address: { type: "string" },
      message: { type: "string" },
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
