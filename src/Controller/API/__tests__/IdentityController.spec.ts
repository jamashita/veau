import express from 'express';
import { OK } from 'http-status';
import 'reflect-metadata';
import supertest from 'supertest';
import { MockAccountName } from '../../../VO/Mock/MockAccountName';
import { MockLanguageID } from '../../../VO/Mock/MockLanguageID';
import { MockRegionID } from '../../../VO/Mock/MockRegionID';
import { MockVeauAccount } from '../../../VO/Mock/MockVeauAccount';
import { MockVeauAccountID } from '../../../VO/Mock/MockVeauAccountID';
import { VeauAccount } from '../../../VO/VeauAccount';
import { IdentityController } from '../IdentityController';

describe('IdentityController', () => {
  describe('GET /', () => {
    it('returns VeauAccount as JSON', async () => {
      const account: VeauAccount = new MockVeauAccount({
        veauAccountID: new MockVeauAccountID(),
        account: new MockAccountName('account'),
        languageID: new MockLanguageID(),
        regionID: new MockRegionID()
      });

      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = account;
        next();
      });
      app.use('/', IdentityController);

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toBe(OK);
      expect(response.body).toEqual(account.toJSON());
    });
  });
});
