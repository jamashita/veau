import * as express from 'express';
import { OK } from 'http-status';
import 'jest';
import * as supertest from 'supertest';
import { Language } from '../../../veau-entity/Language';
import { Region } from '../../../veau-entity/Region';
import { VeauAccount } from '../../../veau-entity/VeauAccount';
import { AccountName } from '../../../veau-vo/AccountName';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { RegionID } from '../../../veau-vo/RegionID';
import { RegionName } from '../../../veau-vo/RegionName';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { IdentityController } from '../IdentityController';

describe('IdentityController', () => {
  describe('GET /', () => {
    it('returns VeauAccount as JSON', async () => {
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
