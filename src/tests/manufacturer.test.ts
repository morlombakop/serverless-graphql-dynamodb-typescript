import { request, gql } from 'graphql-request';

describe('manufacturer api', () => {
  const listQuery = gql`
    {
      manufacturers {
        id
      }
    }
  `;

  const create = gql`
    mutation {
      addManufacturer(manufacturer: { name: Mercedes, modelName: "Class 6" }) {
        id
        name
        modelName
      }
    }
  `;

  it('should create a manufacturer successfully', async () => {
    const data = await request('http://localhost:3000/dev/graphql', create);
    expect(data.addManufacturer.id).toBeDefined();
    expect(data.addManufacturer.name).toStrictEqual('Mercedes');
    expect(data.addManufacturer.modelName).toStrictEqual('Class 6');
  });

  it('should throw error if record exist', async () => {
    try {
      await request('http://localhost:3000/dev/graphql', create);
    } catch (error) {
      const errorString = JSON.stringify(error);
      expect(errorString).toContain(
        'Duplicated manufacturer object. It already exist'
      );
    }
  });

  it('should validate manufacturer existence', async () => {
    const existQuery = gql`
      {
        exist(manufacturer: { name: Mercedes, modelName: "Class 6" })
      }
    `;
    const data = await request('http://localhost:3000/dev/graphql', existQuery);
    expect(data.exist).toEqual(true);

    const doNotExistQuery = gql`
      {
        exist(manufacturer: { name: Mercedes, modelName: "Fake Model" })
      }
    `;
    const result = await request(
      'http://localhost:3000/dev/graphql',
      doNotExistQuery
    );
    expect(result.exist).toEqual(false);
  });

  it('should throw error on bad manufacturer name', async () => {
    const badCreate = gql`
      mutation {
        addManufacturer(
          manufacturer: { name: "Mercedes", modelName: "Class 6" }
        ) {
          id
          name
          modelName
        }
      }
    `;

    try {
      await request('http://localhost:3000/dev/graphql', badCreate);
    } catch (error) {
      const errorString = JSON.stringify(error);
      expect(errorString).toContain('cannot represent non-enum value');
      expect(errorString).toContain('GRAPHQL_VALIDATION_FAILED');
    }
  });

  it('should retrieve manufacturers', async () => {
    const list = await request('http://localhost:3000/dev/graphql', listQuery);
    expect(list.manufacturers.length).toBeGreaterThanOrEqual(1);
  });
});
