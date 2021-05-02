import express, { Express } from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import supertest from 'supertest';
import { kernel } from '../../../Container/Kernel';
import { AccountName } from '../../../domain/VO/Account/AccountName';
import { MockLanguageID } from '../../../domain/VO/Language/Mock/MockLanguageID';
import { MockRegionID } from '../../../domain/VO/Region/Mock/MockRegionID';
import { MockVeauAccount } from '../../../domain/VO/VeauAccount/Mock/MockVeauAccount';
import { MockVeauAccountID } from '../../../domain/VO/VeauAccount/Mock/MockVeauAccountID';
import { VeauAccount } from '../../../domain/VO/VeauAccount/VeauAccount';
import { AccountController } from '../AccountController';

const setAccount = (account: VeauAccount) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.user = account;
    next();
  };
};

describe.skip('AccountController', () => {
  describe('GET /', () => {
    it('returns VeauAccount as JSON', async () => {
      expect.assertions(2);

      const account: VeauAccount = new MockVeauAccount({
        veauAccountID: new MockVeauAccountID(),
        account: AccountName.of('account'),
        languageID: new MockLanguageID(),
        regionID: new MockRegionID()
      });

      const app: Express = express();

      useContainer(kernel);
      app.use(setAccount(account));
      useExpressServer(app, {
        controllers: [AccountController]
      });

      const response: supertest.Response = await supertest(app).get('/accounts');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual(account.toJSON());
    });
  });
});
