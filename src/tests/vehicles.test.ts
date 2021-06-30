import { request, gql } from 'graphql-request';

describe('vehicles api', () => {
  const createManufacturer = gql`
    mutation {
      addManufacturer(
        manufacturer: { name: Porsche, modelName: "718 Spyder" }
      ) {
        id
        name
        modelName
      }
    }
  `;

  const createVehicle = (id: string) => gql`
    mutation {
      addVehicle(
        vehicle: {
          color: "White"
          mileage: 60
          fuelType: Petrol
          vehicleType: Cabriolet
          transmission: ManualGearbox
          manufacturer: {
            id:  "${id}"
            name: Porsche
            modelName: "718 Spyder"
          }
        }
      ) {
        id
        make
        model
        createdAt
        color
        updatedAt
        mileage,
        transmission
        fuelType,
        vehicleType
      }
    }
  `;

  const listQuery = gql`
    {
      vehicles {
        id
        updatedAt
        manufacturer {
          id
          name
          modelName
        }
      }
    }
  `;

  it('should create vehicle successfully', async () => {
    const { addManufacturer } = await request(
      'http://localhost:3000/dev/graphql',
      createManufacturer
    );
    expect(addManufacturer.id).toBeDefined();

    const { addVehicle } = await request(
      'http://localhost:3000/dev/graphql',
      createVehicle(addManufacturer.id)
    );
    expect(addVehicle.id).toBeDefined();
    expect(addVehicle.make).toEqual('Porsche');
    expect(addVehicle.model).toEqual('718 Spyder');
    expect(addVehicle.createdAt).toBeDefined();
    expect(addVehicle.updatedAt).toBeDefined;
    expect(addVehicle.color).toEqual('White');
    expect(addVehicle.mileage).toEqual(60);
    expect(addVehicle.fuelType).toEqual('Petrol');
    expect(addVehicle.vehicleType).toEqual('Cabriolet');
    expect(addVehicle.transmission).toEqual('Manual gearbox');
  });

  it('should retrieve multiple vehicles and one vehicle', async () => {
    const { vehicles } = await request(
      'http://localhost:3000/dev/graphql',
      listQuery
    );
    expect(vehicles.length).toBeGreaterThanOrEqual(1);

    const one = gql`
      {
        vehicle(id: "${vehicles[0].id}"){
          id, model, make, mileage
        }
      }
    `;

    const { vehicle } = await request('http://localhost:3000/dev/graphql', one);
    expect(vehicle.id).toBeDefined();
    expect(vehicle.make).toBeDefined();
    expect(vehicle.model).toBeDefined();
    expect(vehicle.mileage).toBeDefined();
  });

  it('should update vehicle successfully', async () => {
    const { vehicles } = await request(
      'http://localhost:3000/dev/graphql',
      listQuery
    );
    expect(vehicles.length).toBeGreaterThanOrEqual(1);
    const vehicle = vehicles[0];
    const updateVehicle = gql`
      mutation {
        editVehicle(id: "${vehicle.id}", 
          vehicle: {
            color: "White"
            mileage: 80
            fuelType: Petrol
            vehicleType: Cabriolet
            transmission: ManualGearbox
            manufacturer: {
              id:  "${vehicle.manufacturer.id}"
              name: Porsche
              modelName: "718 Spyder"
            }
          }
        ) {
          id
          updatedAt
          mileage
        }
      }
   `;

    const { editVehicle } = await request(
      'http://localhost:3000/dev/graphql',
      updateVehicle
    );
    expect(editVehicle.updatedAt).not.toEqual(vehicle.updatedAt);
  });

  it('should delete vehicle successfully', async () => {
    const { vehicles } = await request(
      'http://localhost:3000/dev/graphql',
      listQuery
    );
    expect(vehicles.length).toBeGreaterThanOrEqual(1);
    const vehicle = vehicles[0];
    const remove = gql`
      mutation {
        deleteVehicle(id: "${vehicle.id}")
      }
    `;

    const { deleteVehicle } = await request(
      'http://localhost:3000/dev/graphql',
      remove
    );

    expect(deleteVehicle).toEqual(true);
  });
});
