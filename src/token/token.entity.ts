import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Token {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
