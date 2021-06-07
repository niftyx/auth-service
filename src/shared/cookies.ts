import { JWT } from "./config/authentication";

import { insertRefreshToken } from "./queries";
import { request } from "./request";
import { v4 as uuidv4 } from "uuid";
import { AccountData } from "./types";

interface InsertRefreshTokenData {
  insert_refresh_tokens_one: {
    user: AccountData;
  };
}

/**
 * New refresh token expiry date.
 */
export function newRefreshExpiry(): number {
  const now = new Date();
  const days = JWT.REFRESH_EXPIRES_IN / 1440;

  return now.setDate(now.getDate() + days);
}

export const setRefreshToken = async (
  accountId: string,
  refresh_token?: string
): Promise<string> => {
  if (!refresh_token) {
    refresh_token = uuidv4();
  }

  (await request(insertRefreshToken, {
    refresh_token_data: {
      user_id: accountId,
      refresh_token,
      expires_at: new Date(newRefreshExpiry()),
    },
  })) as InsertRefreshTokenData;

  return refresh_token;
};
