import { InputType, Field } from "type-graphql";
import { User } from "./user.entity";
import { Length, IsEmail } from "class-validator";

@InputType()
export class UserLoginInput implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 50)
  password: string;
}
