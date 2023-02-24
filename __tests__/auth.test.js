'use strict';

const { server } = require('../src/server');
const supertest = require('supertest');
const { db } = require('../src/models');
const request = supertest(server);

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('Auth router', () => {
  it('creates a user', async () => {
    let response = await request.post('/signup').send({
      username: 'testAdmin',
      password: 'pass123',
      role: 'admin',
    });

    //console.log(response.body);

    expect(response.status).toEqual(201);
    expect(response.body.user.username).toEqual('testAdmin');
  });

  it('allows existing user to signin', async () => {
    // we use the supertest .auth() method to create the basic auth string
    // AND send that in the authorization header

    /** for Basic Auth
     * header: {
     *   Authorizations: Basic <some-encoded-string>
     * }
     */

    let response = await request.post('/signin').auth('testAdmin', 'pass123');

    expect(response.status).toEqual(200);
    expect(response.body.user.username).toEqual('testAdmin');
    expect(response.body.user.password).toBeTruthy();
  });
});

/** for Bearer Auth
 * header: {
 *   Authorizations: Bearer <some-token>
 * }
 */
