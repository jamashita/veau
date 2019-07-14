import * as express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'jest';
import * as sinon from 'sinon';
import { SinonSpy, SinonStub } from 'sinon';
import * as supertest from 'supertest';
import { Language } from '../../../veau-entity/Language';
import { Region } from '../../../veau-entity/Region';
import { VeauAccount } from '../../../veau-entity/VeauAccount';
import { LocaleInteractor } from '../../../veau-interactor/LocaleInteractor';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { RegionID } from '../../../veau-vo/RegionID';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { LocaleController } from '../LocaleController';

describe('LocaleController', () => {
  describe('GET /', () => {
    it('returns JSON as LocaleInteractor returns', async () => {
      const stub: SinonStub = sinon.stub();
      LocaleInteractor.prototype.all = stub;
      stub.resolves({
        languages: [
          Language.from(LanguageID.of(1), 'language', 'english name', ISO639.of('la'))
        ],
        regions: [
          new Region(RegionID.of(1), 'region', ISO3166.of('RGN'))
        ]
      });

      const app: express.Express = express();
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(OK);
      expect(response.body).toEqual({
        languages: [
          {
            languageID: 1,
            name: 'language',
            englishName: 'english name',
            iso639: 'la'
          }
        ],
        regions: [
          {
            regionID: 1,
            name: 'region',
            iso3166: 'RGN'
          }
        ]
      });
    });
  });

  describe('DELETE /', () => {
    it('delete all locales from the cache', async () => {
      const spy: SinonSpy = sinon.spy();
      LocaleInteractor.prototype.delete = spy;
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.from(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
        const region: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
        req.user = new VeauAccount(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), 'account', language, region);
        next();
      });
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(OK);
      expect(spy.called).toEqual(true);
    });

    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      LocaleInteractor.prototype.delete = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.from(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
        const region: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
        req.user = new VeauAccount(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), 'account', language, region);
        next();
      });
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });
  });
});
