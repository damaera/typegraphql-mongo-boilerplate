import * as DataLoader from "dataloader";
import { User, UserModel } from "../user/user.entity";
import { ObjectId } from "mongodb";

export let userLoader = new DataLoader<ObjectId, User, string>(
  async userIds => {
    let users = await UserModel.find({
      _id: { $in: userIds }
    });

    let usersById = users.reduce((prev, curr) => {
      return { ...prev, [(curr._id as ObjectId).toHexString()]: curr };
    }, {});

    return userIds.map(userId => (usersById as any)[userId.toHexString()]);
  },
  {
    cacheKeyFn: key => key.toHexString()
  }
);
