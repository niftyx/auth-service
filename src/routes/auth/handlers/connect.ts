import { InsertAccountData, Session } from "./../../../types/index.d";
import { FastifyReply, FastifyRequest } from "fastify";
import { utils } from "ethers";
import { request } from "../../../shared/request";
import { insertAccount } from "../../../shared/queries";
import { setRefreshToken } from "../../../shared/cookies";
import { createHasuraJwt } from "../../../shared/jwt";
import { newJwtExpiry } from "../../../shared/jwt";
import { selectAccountById } from "../../../shared/helpers";

export const handler = async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { body } = req;
  const { message, signedMessage } = body as any;

  const msgHash = utils.hashMessage(message);
  const msgHashBytes = utils.arrayify(msgHash);

  const signer = utils.recoverAddress(msgHashBytes, signedMessage);
  const accountId = signer.toLowerCase();

  if (!accountId) {
    return reply.code(401).send();
  }

  let accountData = await selectAccountById(accountId);
  if (!accountData) {
    const insertedAccounts = await request<InsertAccountData>(insertAccount, {
      user: {
        id: accountId,
        address: accountId,
        name: "",
        custom_url: "",
        image_url: "",
        header_image_url: "",
        bio: "",
        twitter_username: "",
        twitter_verified: false,
        twitch_username: "",
        facebook_username: "",
        youtube_username: "",
        instagram_username: "",
        tiktok_username: "",
        personal_site: "",
        create_time_stamp: Math.floor(Date.now() / 1000),
        update_time_stamp: Math.floor(Date.now() / 1000),
      },
    });

    accountData = insertedAccounts.insert_users.returning[0];
  }

  // refresh_token
  const refresh_token = await setRefreshToken(reply, accountData.id, false);

  // generate jwt
  const jwt_token = createHasuraJwt(accountData);
  const jwt_expires_in = newJwtExpiry;
  const session: Session = {
    jwt_token,
    jwt_expires_in,
    refresh_token,
  };

  return session;
};
