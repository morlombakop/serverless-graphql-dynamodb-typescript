import { ApolloError } from "apollo-server-lambda";
import { v4 as uuidv4 } from "uuid";

import { CreateManufacturerInput } from "../types/manufacturer.type";
import { dynamodb, promisify } from "./helpers";

export const isExistingManufacturer = (manufacturer: CreateManufacturerInput) => {
  const { name, modelName } = manufacturer;
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    ProjectionExpression: "#name, modelName, id",
    FilterExpression: "#name = :name AND modelName = :modelName",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":modelName": modelName,
    },
  };
  return promisify((callback) => dynamodb.scan(params, callback)).then(
    (result) => {
      // @ts-ignore
      return result.Count > 0;
    }
  );
};

export const createManufacturer = async (
  manufacturer: CreateManufacturerInput
) => {
  const isExist = await isExistingManufacturer(manufacturer);
  if (isExist) {
    throw new ApolloError(
      "Duplicated manufacturer object. It already exist",
      "409"
    );
  } else {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuidv4(),
        ...manufacturer,
      },
    };
    return promisify((callback) => dynamodb.put(params, callback)).then(
      () => params.Item
    );
  }
};

export const getAllManufacturers = () =>
  promisify((callback) => {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Select: "ALL_ATTRIBUTES",
    };
    return dynamodb.scan(params, callback);
  }).then((data) => {
    // @ts-ignore
    return Array.isArray(data.Items) ? data.Items : [];
  });

export const getManufacturer = (id: string) => promisify((callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id }
  };
  return dynamodb.get(params, callback);
}).then((result) => {
  console.log('$$$$', result);
  // @ts-ignore
  const manufacturer = result.Item;
  if(manufacturer){
    return manufacturer;
  } else {
    throw new ApolloError(
      `a manufacturer with the id: ${id} does not exist`,
      "404"
    );
  }


})