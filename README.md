# Serverless GraphQL API with DynamoDB, Typescript and offline support

Hello, I have chosen to take the backend challenge although my latest experiences are in the front-end. The main reason is I'm looking to strengthen my backend skills and Serverless is somehow appetizing :)

## Setup

```bash
npm install
npm run install:db this will download a local version of DynamoDB. (or to use a persistent docker dynamodb instead, open a new terminal: cd ./dynamodb && docker-compose up -d)
npm start to transpile and lunch thr application. Please ensure you only have a single instance of DynamoDB at the port 8000.
Once the app has started go to `http://localhost:3000/dev/graphql` to Use with a GraphQL Playground. Ensure the URL used in the playground is `http://localhost:3000/dev/graphql`.
```

## Usage

The repo is made of two entities `Vehicle` and `Manufacturer`. Each Vehicle has a Manufacturer which means to create vehicle, we need to create a Manufacturer first and attach it to the Vehicle.
