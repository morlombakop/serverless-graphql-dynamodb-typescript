import { request, gql } from 'graphql-request';

describe('vehicles api', () => {
  const listQuery = gql`
    {
      vehicles {
        id
      }
    }
  `;

  it('should retrieve vehicles', async () => {
    const list = await request('http://localhost:3000/dev/graphql', listQuery);
    expect(list.vehicles.length).toEqual(0);
  });
})