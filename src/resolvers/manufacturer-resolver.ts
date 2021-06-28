import { Resolver, Query, Mutation, Arg } from "type-graphql";
import {
  createManufacturer,
  getAllManufacturers,
  isExistingManufacturer,
  getManufacturer,
} from "../repositories/manufacturer.repository";
import {
  CreateManufacturerInput,
  ManufacturerType,
} from "../types/manufacturer.type";

@Resolver()
export class ManufacturerResolver {
  @Query((returns) => [ManufacturerType])
  async manufacturers() {
    return await getAllManufacturers();
  }

  @Query((returns) => ManufacturerType)
  async manufacturer(@Arg("id", (type) => String) id: string) {
    return await getManufacturer(id);
  }

  @Mutation((returns) => ManufacturerType)
  async addManufacturer(
    @Arg("manufacturer") manufacturer: CreateManufacturerInput
  ) {
    return await createManufacturer(manufacturer);
  }

  @Mutation((returns) => Boolean)
  async exist(@Arg("manufacturer") manufacturer: CreateManufacturerInput) {
    return await isExistingManufacturer(manufacturer);
  }
}
