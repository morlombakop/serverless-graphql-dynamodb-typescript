import "reflect-metadata";
import { ApolloServer } from "apollo-server-lambda";
import { buildSchema } from "type-graphql";
import {
  Context,
  APIGatewayProxyEvent,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";

import { ManufacturerResolver } from "./resolvers/manufacturer-resolver";

async function bootstrap(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) {
  const schema = await buildSchema({
    resolvers: [ManufacturerResolver],
    dateScalarMode: "isoDate",
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
    debug: false,
  });

  server.createHandler()(event, context, callback);
}

export function graphql(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) {
  bootstrap(event, context, callback);
}
