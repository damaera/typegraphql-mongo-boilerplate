import { AuthChecker } from "type-graphql";

import { Context } from "./context";
import { ObjectId } from "mongodb";
import { Roles } from "./types";

import { Workspace } from "./workspace/workspace.entity";
import { Channel } from "./channel/channel.entity";

export let authChecker: AuthChecker<Context, Roles> = (
  { root, args, context, info },
  roles
) => {
  if (!context.user) {
    return false;
  }

  if (root instanceof Workspace) {
    if (roles.includes(Roles.WorkspaceMember)) {
      let isMeMember = false;

      for (let i = 0; i < root.members.length; i++) {
        let member = root.members[i];
        if ((member as ObjectId).equals(context.user.userId)) {
          isMeMember = true;
          break;
        }
      }

      if (!isMeMember) {
        return false;
      }
    }
  }

  if (root instanceof Channel) {
    if (roles.includes(Roles.ChannelMember)) {
      let isMeMember = false;

      for (let i = 0; i < root.members.length; i++) {
        let member = root.members[i];
        if ((member as ObjectId).equals(context.user.userId)) {
          isMeMember = true;
          break;
        }
      }

      if (!isMeMember) {
        return false;
      }
    }
  }

  return true;
};
