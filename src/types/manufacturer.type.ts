import { ObjectType, Field, ID, registerEnumType, InputType } from "type-graphql";

enum Manufacturer {
  Audi = "Audi",
  BMW = "BMW",
  VW = "VW",
  Mercedes = "Mercedes",
  Porsche = "Porsche",
}

registerEnumType(Manufacturer, {
  name: "Manufacturer",
  description: "Available list of manufacturers name"
});

@InputType()
@ObjectType()
export class ManufacturerType {
  @Field((type) => ID)
  id: string;
  @Field((type) => Manufacturer)
  name: Manufacturer;
  @Field()
  modelName: string;
}

@InputType()
export class CreateManufacturerInput {
  @Field((type) => Manufacturer)
  name: Manufacturer;
  @Field()
  modelName: string;
}

@InputType()
export class ManufacturerInput {
  @Field((type) => ID)
  id: string;
  @Field((type) => Manufacturer)
  name: Manufacturer;
  @Field()
  modelName: string;
}
