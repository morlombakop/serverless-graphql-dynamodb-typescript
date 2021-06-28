import "reflect-metadata";
import { ApolloServer } from "apollo-server-lambda";
import { buildSchema } from "type-graphql";
import {
  Context,
  APIGatewayProxyEvent,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";

import { ManufacturerResolver } from "./resolvers/manufacturer.resolver";
import { VehicleResolver } from "./resolvers/vehicle.resolver";

async function bootstrap(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) {
  const schema = await buildSchema({
    resolvers: [ManufacturerResolver, VehicleResolver],
    dateScalarMode: "isoDate",
  });

  const server = new ApolloServer({
    schema,
    playground: {
      settings: {
        "schema.polling.enable": false,
      }
    },
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
