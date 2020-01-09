import {
  prop as Property,
  arrayProp as ArrayProperty,
  getModelForClass,
  Ref
} from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";
import { Token } from "../token/token.entity";

@ObjectType()
export class User {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true, unique: true })
  email: string;

  @Property({ required: true })
  password: string;

  @Field({ nullable: true })
  @Property()
  name?: string;

  @Field(type => Token, { nullable: true })
  token?: Token;
}
export let UserModel = getModelForClass(User);
