import { Resolver, Query, Mutation, Arg } from "type-graphql";

import {
  getAllVehicles,
  createVehicle,
  getVehicle,
  deleteVehicle,
  updateVehicle,
} from "../repositories/vehicle.repository";
import { VehicleInput, VehicleType } from "../types/vehicle.type";

@Resolver()
export class VehicleResolver {
  @Query((returns) => [VehicleType])
  async vehicles() {
    return await getAllVehicles();
  }

  @Query((returns) => VehicleType)
  async vehicle(@Arg("id", (type) => String) id: string) {
    return await getVehicle(id);
  }

  @Mutation((returns) => VehicleType)
  async addVehicle(@Arg("vehicle") vehicle: VehicleInput) {
    return await createVehicle(vehicle);
  }

  @Mutation((returns) => Boolean)
  async deleteVehicle(@Arg("id", (type) => String) id: string) {
    return await deleteVehicle(id);
  }

  @Mutation((returns) => VehicleType)
  async editVehicle(
    @Arg("id", (type) => String) id: string,
    @Arg("vehicle") vehicle: VehicleInput
  ) {
    return await updateVehicle(id, vehicle);
  }
}
