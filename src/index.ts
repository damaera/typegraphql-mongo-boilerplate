import "reflect-metadata";
require("dotenv").config();
import { ApolloServer } from "apollo-server";
import { connect } from "mongoose";
import { ObjectId } from "mongodb";
import * as path from "path";
import { buildSchema } from "type-graphql";

import { UserResolver } from "./user/user.resolver";
import { WorkspaceResolver } from "./workspace/workspace.resolver";

import { TypegooseMiddleware } from "./middlewares/typegoose.middleware";
import { ObjectIdScalar } from "./scalars/object-id.scalar";
import { authChecker } from "./auth-checker";
import { formatError } from "./format-error";
import { context } from "./context";

async function bootstrap() {
  try {
    // create mongoose connection
    let mongoose = await connect(process.env.MONGO_URI as string);
    mongoose.set("debug", true);

    // build TypeGraphQL executable schema
    let schema = await buildSchema({
      resolvers: [__dirname + "/**/*.resolver.ts"],
      emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
      authChecker,
      // use document converting middleware
      globalMiddlewares: [TypegooseMiddleware],
      // use ObjectId scalar mapping
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }]
    });

    // Create GraphQL server
    let server = new ApolloServer({
      schema,
      formatError,

      context
    });

    // Start the server
    let { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
