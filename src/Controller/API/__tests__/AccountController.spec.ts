import express from 'express';
import { OK } from 'http-status';
import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import supertest from 'supertest';
import { MockAccountName } from '../../../VO/Mock/MockAccountName';
import { MockLanguageID } from '../../../VO/Mock/MockLanguageID';
import { MockRegionID } from '../../../VO/Mock/MockRegionID';
import { MockVeauAccount } from '../../../VO/Mock/MockVeauAccount';
import { MockVeauAccountID } from '../../../VO/Mock/MockVeauAccountID';
import { VeauAccount } from '../../../VO/VeauAccount';
import { AccountController } from '../AccountController';

const setAccount = (account: VeauAccount) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.user = account;
    next();
  };
};

describe('AccountController', () => {
  describe('GET /', () => {
    it('returns VeauAccount as JSON', async () => {
      const account: VeauAccount = new MockVeauAccount({
        veauAccountID: new MockVeauAccountID(),
        account: new MockAccountName('account'),
        languageID: new MockLanguageID(),
        regionID: new MockRegionID()
      });

      const app: express.Express = express();
      app.use(setAccount(account));
      useExpressServer(app, {
        controllers: [
          AccountController
        ]
      });

      const response: supertest.Response = await supertest(app).get('/accounts');
      expect(response.status).toBe(OK);
      expect(response.body).toEqual(account.toJSON());
    });
  });
});
