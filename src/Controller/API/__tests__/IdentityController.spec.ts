import express from 'express';
import { OK } from 'http-status';
import 'reflect-metadata';
import supertest from 'supertest';
import { MockAccountName } from '../../../VO/Mock/MockAccountName';
import { MockISO3166 } from '../../../VO/Mock/MockISO3166';
import { MockISO639 } from '../../../VO/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Mock/MockLanguageID';
import { MockLanguageName } from '../../../VO/Mock/MockLanguageName';
import { MockRegion } from '../../../VO/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Mock/MockRegionID';
import { MockRegionName } from '../../../VO/Mock/MockRegionName';
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
        language: new MockLanguage({
          languageID: new MockLanguageID(1),
          name: new MockLanguageName('Abkhazian'),
          iso639: new MockISO639('ab')
        }),
        region: new MockRegion({
          regionID: new MockRegionID(1),
          name: new MockRegionName('Afghanistan'),
          iso3166: new MockISO3166('AFG')
        })
      });

      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        // @ts-ignore
        req.user = account;
        next();
      });
      app.use('/', IdentityController);

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(OK);
      expect(response.body).toEqual(account.toJSON());
    });
  });
});
