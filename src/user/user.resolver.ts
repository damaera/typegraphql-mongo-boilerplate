import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Authorized,
  FieldResolver,
  Root,
  Ctx
} from "type-graphql";
import { User, UserModel } from "./user.entity";
import { UserRegisterInput } from "./user-register.input";
import { UserLoginInput } from "./user-login.input";
import Argon2 = require("argon2");
import { createNewPairToken } from "../token/token.helpers";
import { UnauthorizedError } from "../errors/error";
import { GraphQLError } from "graphql";
import { Context } from "../context";

@Resolver(of => User)
export class UserResolver {
  @Authorized()
  @Query(returns => User)
  async userGetMe(@Ctx() ctx: Context): Promise<User> {
    let userId = ctx.user.userId;
    return (await UserModel.findById(userId)) as User;
  }

  @Mutation(returns => User)
  async userRegister(@Arg("input") input: UserRegisterInput): Promise<User> {
    // hash password
    let hashedPassword = await Argon2.hash(input.password);
    let newUser = await UserModel.create({
      ...input,
      password: hashedPassword
    });
    return {
      ...newUser.toObject(),
      token: createNewPairToken(newUser._id.toHexString())
    };
  }

  @Mutation(returns => User)
  async userLogin(@Arg("input") input: UserLoginInput): Promise<User> {
    // find user by only email first,
    // then verify password
    // if verified, create token
    let foundUser = await UserModel.findOne({ email: input.email });
    if (!foundUser) {
      throw UnauthorizedError(new GraphQLError(""), "Email not found");
    }
    let isPasswordVerified = await Argon2.verify(
      foundUser.password,
      input.password
    );
    if (!isPasswordVerified) {
      throw UnauthorizedError(new GraphQLError(""), "Password not match");
    }
    return {
      ...foundUser.toObject(),
      token: createNewPairToken(foundUser._id.toHexString())
    };
  }
}
