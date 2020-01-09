import { AuthChecker } from "type-graphql";

import { Context } from "./context";
import { ObjectId } from "mongodb";
import { Roles } from "./types";

export let authChecker: AuthChecker<Context, Roles> = (
  { root, args, context, info },
  roles
) => {
  if (!context.user) {
    return false;
  }

  return true;
};
