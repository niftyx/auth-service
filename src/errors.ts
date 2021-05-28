import * as HttpStatus from "http-status-codes";

// tslint:disable:max-classes-per-file

// base class for all the named errors in this file
export abstract class APIBaseError extends Error {
  public abstract statusCode: number;
  public isAPIError = true;
}

export class NotFoundError extends APIBaseError {
  public statusCode = HttpStatus.NOT_FOUND;
}

export class InternalServerError extends APIBaseError {
  public statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
}
