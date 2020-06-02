import 'reflect-metadata';

import express, { Express, NextFunction, Request, Response } from 'express';
import { OK } from 'http-status';
import { useExpressServer } from 'routing-controllers';
import supertest from 'supertest';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { MockAccountName } from '../../../VO/Account/Mock/MockAccountName';
import { MockLanguageID } from '../../../VO/Language/Mock/MockLanguageID';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { MockVeauAccount } from '../../../VO/VeauAccount/Mock/MockVeauAccount';
import { MockVeauAccountID } from '../../../VO/VeauAccount/Mock/MockVeauAccountID';
import { VeauAccount } from '../../../VO/VeauAccount/VeauAccount';
import { AccountController } from '../AccountController';

const setAccount = (account: VeauAccount) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.user = account;
    next();
  };
};

describe('AccountController', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const accountController1: AccountController = kernel.get<AccountController>(Type.AccountController);
      const accountController2: AccountController = kernel.get<AccountController>(Type.AccountController);

      expect(accountController1).toBeInstanceOf(AccountController);
      expect(accountController1).toBe(accountController2);
    });
  });

  describe('GET /', () => {
    it('returns VeauAccount as JSON', async () => {
      const account: VeauAccount = new MockVeauAccount({
        veauAccountID: new MockVeauAccountID(),
        account: new MockAccountName('account'),
        languageID: new MockLanguageID(),
        regionID: new MockRegionID()
      });

      const app: Express = express();

      app.use(setAccount(account));
      useExpressServer(app, {
        controllers: [AccountController]
      });

      const response: supertest.Response = await supertest(app).get('/accounts');

      expect(response.status).toBe(OK);
      expect(response.body).toEqual(account.toJSON());
    });
  });
});
