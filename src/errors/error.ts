import { ApolloError } from "apollo-server";
import { GraphQLError } from "graphql";

enum ErrorType {
  NoData = "204_NO_DATA",
  BadRequest = "400_BAD_REQUEST",
  TokenExpired = "401_TOKEN_EXPIRED",
  Unauthorized = "401_UNAUTHORIZED",
  Forbidden = "403_FORBIDDEN",
  NotFound = "404_NOT_FOUND",
  ServerError = "500_SERVER_ERROR",
  Unknown = "500_UNKNOWN"
}

let createError = (
  type: ErrorType = ErrorType.ServerError,
  err?: GraphQLError,
  message?: string
) => {
  let errorMessage = "";
  if (message) {
    errorMessage = message;
  } else if (err?.message) {
    errorMessage = err.message;
  }
  return new ApolloError(errorMessage, type, {
    ...err?.extensions,
    locations: err?.locations,
    path: err?.path
  });
};

export let TokenExpiredError = (err?: GraphQLError, message?: string) =>
  createError(ErrorType.TokenExpired, err, message);

export let UnauthorizedError = (err?: GraphQLError, message?: string) =>
  createError(ErrorType.Unauthorized, err, message);

export let UnknownError = (err?: GraphQLError, message?: string) =>
  createError(ErrorType.Unknown, err, message);

export let ServerError = (err?: GraphQLError, message?: string) =>
  createError(ErrorType.ServerError, err, message);

export let NotFoundError = (err?: GraphQLError, message?: string) =>
  createError(ErrorType.NotFound, err, message);

export let BadRequestError = (err?: GraphQLError, message?: string) =>
  createError(ErrorType.BadRequest, err, message);
