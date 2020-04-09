import express from 'express';
import { OK } from 'http-status';
import 'reflect-metadata';
import supertest from 'supertest';
import { AccountName } from '../../../veau-vo/AccountName';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { Region } from '../../../veau-vo/Region';
import { RegionID } from '../../../veau-vo/RegionID';
import { RegionName } from '../../../veau-vo/RegionName';
import { VeauAccount } from '../../../veau-vo/VeauAccount';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { IdentityController } from '../IdentityController';

describe('IdentityController', () => {
  describe('GET /', () => {
    it('returns VeauAccount as JSON', async () => {
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', IdentityController);

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(OK);
      expect(response.body).toEqual({
        veauAccountID: '6ffd502d-e6d9-450c-81c6-05806302ed1b',
        account: 'account',
        language: {
          languageID: 1,
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        region: {
          regionID: 1,
          name: 'Afghanistan',
          iso3166: 'AFG'
        }
      });
    });
  });
});
