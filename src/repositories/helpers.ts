
import AWS from 'aws-sdk';

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}

export const dynamodb = new AWS.DynamoDB.DocumentClient(options);

export const promisify = (func) =>
new Promise((resolve, reject) => {
  func((error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });
});