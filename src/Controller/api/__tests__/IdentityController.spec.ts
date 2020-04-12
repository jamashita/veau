import express from 'express';
import { OK } from 'http-status';
import 'reflect-metadata';
import supertest from 'supertest';
import { AccountName } from '../../../VO/AccountName';
import { ISO3166 } from '../../../VO/ISO3166';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { LanguageID } from '../../../VO/LanguageID';
import { LanguageName } from '../../../VO/LanguageName';
import { Region } from '../../../VO/Region';
import { RegionID } from '../../../VO/RegionID';
import { RegionName } from '../../../VO/RegionName';
import { VeauAccount } from '../../../VO/VeauAccount';
import { VeauAccountID } from '../../../VO/VeauAccountID';
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
