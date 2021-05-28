import { COOKIES, REGISTRATION } from "./config/authentication";
import { NextFunction, Response } from "express";
import {
  rotateTicket as rotateTicketQuery,
  selectAccountByEmail as selectAccountByEmailQuery,
  selectAccountByTicket as selectAccountByTicketQuery,
  selectAccountByUserId as selectAccountByUserIdQuery,
} from "./queries";

import { request } from "./request";
import { v4 as uuidv4 } from "uuid";
import {
  AccountData,
  QueryAccountData,
  PermissionVariables,
  RequestExtended,
} from "./../types";

/**
 * This wrapper function sends any route errors to `next()`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asyncWrapper(fn: any) {
  return function (
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): void {
    fn(req, res, next).catch(next);
  };
}

export const selectAccountByEmail = async (
  email: string
): Promise<AccountData> => {
  const hasuraData = await request<QueryAccountData>(
    selectAccountByEmailQuery,
    { email }
  );
  if (!hasuraData.auth_accounts[0]) throw new Error("Account does not exist.");
  return hasuraData.auth_accounts[0];
};

export const selectAccountByTicket = async (
  ticket: string
): Promise<AccountData> => {
  const hasuraData = await request<QueryAccountData>(
    selectAccountByTicketQuery,
    {
      ticket,
      now: new Date(),
    }
  );
  if (!hasuraData.auth_accounts[0]) throw new Error("Account does not exist.");
  return hasuraData.auth_accounts[0];
};

// TODO await request returns undefined if no user found!
export const selectAccountByUserId = async (
  user_id: string | undefined
): Promise<AccountData> => {
  if (!user_id) {
    throw new Error("Invalid User Id.");
  }
  const hasuraData = await request<QueryAccountData>(
    selectAccountByUserIdQuery,
    { user_id }
  );
  if (!hasuraData.auth_accounts[0]) throw new Error("Account does not exist.");
  return hasuraData.auth_accounts[0];
};

/**
 * Looks for an account in the database, first by email, second by ticket
 * @param httpBody
 * @return account data, null if account is not found
 */
export const selectAccount = async (httpBody: {
  [key: string]: string;
}): Promise<AccountData | undefined> => {
  const { email, ticket } = httpBody;
  try {
    return await selectAccountByEmail(email);
  } catch {
    if (!ticket) {
      return undefined;
    }
    try {
      return await selectAccountByTicket(ticket);
    } catch {
      return undefined;
    }
  }
};

export const rotateTicket = async (ticket: string): Promise<string> => {
  const new_ticket = uuidv4();
  await request(rotateTicketQuery, {
    ticket,
    now: new Date(),
    new_ticket,
  });
  return new_ticket;
};

export const getPermissionVariablesFromCookie = (
  req: RequestExtended
): PermissionVariables => {
  const { permission_variables } = COOKIES.SECRET
    ? req.signedCookies
    : req.cookies;
  if (!permission_variables) throw new Error("No permission variables");
  return JSON.parse(permission_variables);
};
