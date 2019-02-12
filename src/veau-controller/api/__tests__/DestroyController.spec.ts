/* tslint:disable */
import * as express from 'express';
import { OK } from 'http-status';
import 'jest';
import * as supertest from 'supertest';
import { DestroyController } from '../DestroyController';

describe('DestroyController', () => {
  it('GET /: no session returns OK', async () => {
    const app: express.Express = express();
    app.use('/', DestroyController);

    const response: supertest.Response = await supertest(app).get('/');
    expect(response.status).toEqual(OK);
  });
});
