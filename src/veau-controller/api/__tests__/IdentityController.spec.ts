import * as express from 'express';
import { OK } from 'http-status';
import 'jest';
import * as supertest from 'supertest';
import { Language } from '../../../veau-entity/Language';
import { Region } from '../../../veau-entity/Region';
import { VeauAccount } from '../../../veau-entity/VeauAccount';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { RegionID } from '../../../veau-vo/RegionID';
import { UUID } from '../../../veau-vo/UUID';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { IdentityController } from '../IdentityController';

describe('IdentityController', () => {
  describe('GET /', () => {
    it('returns VeauAccount as JSON', async () => {
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = new Language(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
        const region: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', language, region);
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
