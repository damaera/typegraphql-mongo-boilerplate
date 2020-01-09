import { Token } from "./token.entity";
import { Resolver, Mutation, Arg } from "type-graphql";
import { createRefreshPairToken } from "./token.helpers";

@Resolver(of => Token)
export class TokenResolver {
  @Mutation(returns => Token)
  async tokenRefresh(
    @Arg("refreshToken") refreshToken: string
  ): Promise<Token> {
    return createRefreshPairToken(refreshToken);
  }
}
