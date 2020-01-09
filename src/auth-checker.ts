import { AuthChecker } from "type-graphql";

import { Context } from "./context";
import { ObjectId } from "mongodb";

export let authChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles
) => {
  if (!context.user) {
    return false;
  }

  return true;
};
