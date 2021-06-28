import {
  ObjectType,
  Field,
  ID,
  Int,
  InputType,
  registerEnumType,
} from "type-graphql";
import { IsInt, Min } from "class-validator";

import { ManufacturerInput, ManufacturerType } from "./manufacturer.type";

enum Fuel {
  Petrol = "Petrol",
  Diesel = "Diesel",
  Electric = "Electric",
  PLG = "LPG",
  Hybrid = "Hybrid",
}

enum Vehicle {
  Cabriolet = "Cabriolet",
  Coupe = "Coupe",
  EstateCar = "Estate car",
  SUV = "SUV",
  Saloon = "Saloon",
  Van = "Van",
  SmallCar = "Small car",
  Other = "Other",
}

enum Transmission {
  ManualGearbox = "Manual gearbox",
  SemiAutomatic = "Semi-automatic",
  AutomaticTransmission = "Automatic transmission",
}

registerEnumType(Transmission, {
  name: "Transmission",
  description: "Available list of transmissions name",
});

registerEnumType(Vehicle, {
  name: "Vehicle",
  description: "Available list of vehicle type name",
});

registerEnumType(Fuel, {
  name: "Fuel",
  description: "Available list of fuel type name",
});

@ObjectType()
export class VehicleType {
  @Field((type) => ID)
  id: string;
  @Field()
  color: string;
  @Field((type) => Int)
  @IsInt()
  @Min(0)
  mileage: number;
  @Field()
  fuelType: string;
  @Field()
  vehicleType: string;
  @Field()
  transmission: string;
  @Field((type) => ManufacturerType)
  manufacturer: ManufacturerType;
  @Field()
  createdAt: string;
  @Field()
  updatedAt: string;

  @Field()
  get make(): string {
    return this.manufacturer.name;
  }

  @Field()
  get model(): string {
    return this.manufacturer.modelName;
  }
}

@InputType()
export class CreateVehicleInput {
  @Field()
  color: string;
  @Field((type) => Int)
  @IsInt()
  @Min(0)
  mileage: number;
  @Field((type) => Fuel)
  fuelType: Fuel;
  @Field((type) => Vehicle)
  vehicleType: Vehicle;
  @Field((type) => Transmission)
  transmission: Transmission;
  @Field((type) => ManufacturerInput)
  manufacturer: ManufacturerInput;
}

@InputType()
export class EditVehicleInput {
  @Field({ nullable: true })
  color?: string;
  @Field((type) => Int, { nullable: true })
  @IsInt()
  @Min(0)
  mileage?: number;
  @Field((type) => Fuel, { nullable: true })
  fuelType?: Fuel;
  @Field((type) => Vehicle, { nullable: true })
  vehicleType?: Vehicle;
  @Field((type) => Transmission, { nullable: true })
  transmission?: Transmission;
  @Field((type) => ManufacturerInput, { nullable: true })
  manufacturer?: ManufacturerInput;
}
