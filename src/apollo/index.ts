import { handler as connectHandler } from "./handlers/connect";

const schema = `
  type Query {
    signIn(message: String!, signedMessage: String!): SignInResponse
  }

  type SignInResponse {
      jwt_token: String
      jwt_expires_in: Int
      refresh_token: String
  }
`;

const resolvers = {
  Query: {
    signIn: async (_: any, args: any) => {
      const { message, signedMessage } = args;
      return await connectHandler(message, signedMessage);
    },
  },
};

export default {
  schema,
  resolvers,
};
