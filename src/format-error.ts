import {
  TokenExpiredError,
  UnknownError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError
} from "./errors/error";
import { GraphQLError } from "graphql";

export let formatError = (err: GraphQLError) => {
  if (err.name === "TokenExpiredError") {
    return TokenExpiredError(err);
  }

  if (err.message.startsWith("Access denied")) {
    return UnauthorizedError(err);
  }

  if (err.message.startsWith("not found")) {
    return NotFoundError(err);
  }

  if (err.message.startsWith('Variable "')) {
    return BadRequestError(err);
  }

  if (err.message.startsWith("E11000 duplicate")) {
    return BadRequestError(err, "Duplicate Key Error");
  }

  return err;
};
