import { COOKIES, JWT } from "./config/authentication";

import { insertRefreshToken } from "./queries";
import { request } from "./request";
import { v4 as uuidv4 } from "uuid";
import { AccountData } from "./types";
import { generatePermissionVariables } from "./jwt";
import { FastifyReply } from "fastify";

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

/**
 * Set refresh token as a cookie
 * @param res Fastify Reply
 * @param refresh_token Refresh token to be set
 */
export const setCookie = (
  res: FastifyReply,
  refresh_token: string,
  permission_variables: string
): void => {
  // converting JWT_REFRESH_EXPIRES_IN from minutes to milliseconds
  const maxAge = JWT.REFRESH_EXPIRES_IN * 60 * 1000;

  // set refresh token as cookie
  res.setCookie("refresh_token", refresh_token, {
    httpOnly: true,
    maxAge,
    signed: Boolean(COOKIES.SECRET),
    sameSite: COOKIES.SAME_SITE,
    secure: COOKIES.SECURE,
  });

  // set permission variables cookie
  res.setCookie("permission_variables", permission_variables, {
    httpOnly: true,
    maxAge,
    signed: Boolean(COOKIES.SECRET),
    sameSite: COOKIES.SAME_SITE,
    secure: COOKIES.SECURE,
  });
};

/**
 * Insert new refresh token in database and maybe set new refresh token as cookie.
 * @param res Fastify Reply
 * @param accountId Account ID
 * @param useCookie (optional) if the cookie should be set or not
 * @param refresh_token (optional) Refresh token to be set
 */
export const setRefreshToken = async (
  res: FastifyReply,
  accountId: string,
  useCookie = false,
  refresh_token?: string
): Promise<string> => {
  if (!refresh_token) {
    refresh_token = uuidv4();
  }

  const insert_account_data = (await request(insertRefreshToken, {
    refresh_token_data: {
      user_id: accountId,
      refresh_token,
      expires_at: new Date(newRefreshExpiry()),
    },
  })) as InsertRefreshTokenData;

  if (useCookie) {
    const { user: account } = insert_account_data.insert_refresh_tokens_one;
    const permission_variables = JSON.stringify(
      generatePermissionVariables(account)
    );
    setCookie(res, refresh_token, permission_variables);
  } else {
    res.clearCookie("refresh_token");
    res.clearCookie("permission_variables");
  }

  return refresh_token;
};
