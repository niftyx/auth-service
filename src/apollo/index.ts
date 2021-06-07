import { selectAccountById } from "../shared/helpers";
import { handler as connectHandler } from "./handlers/connect";

const schema = `
  type Query {
    profiles(id: String!): ProfileInfo
    signIn(message: String!, signedMessage: String!): SignInResponse
  }

  type ProfileInfo {
    id: String
    address: String
    name: String
    custom_url: String
    image_url: String
    header_image_url: String
    bio: String
    twitter_username: String
    twitter_verified: Boolean
    twitch_username: String
    facebook_username: String
    youtube_username: String
    instagram_username: String
    tiktok_username: String
    personal_site: String
    create_time_stamp: Int
    update_time_stamp: Int
  }

  type SignInResponse {
      jwt_token: String
      jwt_expires_in: Int
      refresh_token: String
  }
`;

const resolvers = {
  Query: {
    profiles: async (_: any, args: any) => {
      // let response;
      const userId = (args.id || "").toLowerCase();
      const userData = await selectAccountById(userId);
      if (!userData) {
        throw new Error("Invalid id!");
      }
      return userData;
    },
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
