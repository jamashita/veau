/* tslint:disable */
import * as express from 'express';
import { OK } from 'http-status';
import 'jest';
import * as supertest from 'supertest';
import { VeauAccount } from '../../../veau-entity/VeauAccount';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { UUID } from '../../../veau-vo/UUID';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { IdentityController } from '../IdentityController';

describe('IdentityController', () => {
  it('GET /', async () => {
    const app: express.Express = express();
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
      next();
    });
    app.use('/', IdentityController);

    const response: supertest.Response = await supertest(app).get('/');
    expect(response.status).toEqual(OK);
    expect(response.body).toEqual({
      id: '6ffd502d-e6d9-450c-81c6-05806302ed1b',
      account: 'account',
      language: 'ab',
      region: 'AFG'
    });
  });
});
