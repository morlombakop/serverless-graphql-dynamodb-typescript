import { Resolver, Query, /* Mutation, Arg */ } from "type-graphql";

@Resolver()
export class ManufacturerResolver {
  @Query((returns) => [String])
  async manufacturers() {
    return ['Morlo', 'Ingrid'];
  }
}
