import { ApolloError } from 'apollo-server-lambda';
import { v4 as uuidv4 } from 'uuid';
import isEmpty from 'lodash/isEmpty';

import { VehicleInput } from '../types/vehicle.type';
import { getManufacturer } from './manufacturer.repository';
import { dynamodb, promisify } from './helpers';
import { ManufacturerInput } from 'src/types/manufacturer.type';

const TableName = process.env.VEHICLE_TABLE;

export const getAllVehicles = () =>
  promisify((callback) => {
    const params = { TableName, Select: 'ALL_ATTRIBUTES' };
    return dynamodb.scan(params, callback);
  }).then((data) => {
    // @ts-ignore
    return Array.isArray(data.Items) ? data.Items : [];
  });

export const getVehicle = (id: string) =>
  promisify((callback) => {
    const params = {
      TableName,
      Key: { id },
    };
    return dynamodb.get(params, callback);
  }).then((result) => {
    // @ts-ignore
    const vehicle = result.Item;
    if (vehicle) {
      return vehicle;
    } else {
      throw new ApolloError(
        `a vehicle with the id: ${id} does not exist`,
        '404'
      );
    }
  });

const isEqualItem = (a: ManufacturerInput, b: ManufacturerInput) => {
  return a.id === b.id && a.modelName === b.modelName && a.name === b.name;
};

export const createVehicle = async (vehicle: VehicleInput) => {
  const manufacturer = await getManufacturer(vehicle.manufacturer.id);
  if (!isEqualItem(manufacturer, vehicle.manufacturer)) {
    throw new ApolloError(
      'Invalid manufacturer object. Please provide an existing manufacturer',
      '400'
    );
  } else {
    const timestamp = new Date().toISOString();
    const params = {
      TableName,
      Item: {
        id: uuidv4(),
        createdAt: timestamp,
        updatedAt: timestamp,
        ...vehicle,
      },
    };
    return promisify((callback) => dynamodb.put(params, callback)).then(
      () => params.Item
    );
  }
};

export const deleteVehicle = (id: string): Promise<boolean> =>
  promisify((callback) => {
    const params = {
      TableName,
      Key: { id },
    };
    return dynamodb.delete(params, callback);
  }).then((result) => isEmpty(result));

export const updateVehicle = async (id: string, vehicle: VehicleInput) => {
  const manufacturer = await getManufacturer(vehicle.manufacturer.id);
  if (!isEqualItem(manufacturer, vehicle.manufacturer)) {
    throw new ApolloError(
      'Invalid manufacturer object. Please provide an existing manufacturer',
      '400'
    );
  } else {
    const params = {
      TableName,
      Key: { id },
      UpdateExpression:
        // eslint-disable-next-line max-len
        'set color=:color, mileage=:mileage, updatedAt=:upda, fuelType=:fuel, manufacturer=:manu, vehicleType=:v, transmission=:trans',
      ExpressionAttributeValues: {
        ':upda': new Date().toISOString(),
        ':color': vehicle.color,
        ':mileage': vehicle.mileage,
        ':fuel': vehicle.fuelType,
        ':trans': vehicle.transmission,
        ':manu': vehicle.manufacturer,
        ':v': vehicle.vehicleType,
      },
      ReturnValues: 'UPDATED_NEW',
    };
    return promisify((callback) => dynamodb.update(params, callback)).then(() =>
      getVehicle(id)
    );
  }
};
