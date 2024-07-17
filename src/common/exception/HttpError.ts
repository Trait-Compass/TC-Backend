import {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
} from './http-status-code';

export class HttpError extends Error {
  readonly statusCode: number;
  readonly responseCode: string;
  readonly errorMessage: string;

  constructor(
    statusCode: ClientErrorStatusCode | ServerErrorStatusCode,
    responseCode: string,
    errorMessage: string,
  ) {
    super(errorMessage);
    this.statusCode = statusCode;
    this.responseCode = responseCode;
    this.errorMessage = errorMessage;
  }
}

export enum HttpErrorCode {}
