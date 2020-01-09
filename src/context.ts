import * as jwt from "jsonwebtoken";
import { TokenExpiredError } from "./errors/error";

import { userLoader } from "./dataloaders/user.loader";

export interface Context {
  connection?: any;
  req?: any;
  user: {
    userId: string;
    workspaceId: string;
    iat: number;
    exp: number;
  };
  loaders: {
    userLoader: typeof userLoader;
  };
}

export let context = (ctx: Context) => {
  let user: any = null;
  try {
    let authToken = "";

    if (ctx.connection) authToken = ctx.connection?.context?.Authorization;
    else if (ctx.req) authToken = ctx.req?.headers?.authorization;

    if (!authToken) {
      return false;
    }
    let jwtToken = authToken.split("Bearer ")[1];
    if (!jwtToken) {
      return false;
    }
    user = jwt.verify(jwtToken, process.env.JWT_ACCESS_TOKEN_SECRET as string);
  } catch (e) {
    if (e.message === "jwt expired") {
      throw TokenExpiredError();
    }
    throw e;
  }
  let context: Context = { user, loaders: { userLoader } };
  return context;
};
