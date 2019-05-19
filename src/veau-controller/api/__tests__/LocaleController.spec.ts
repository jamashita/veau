/* tslint:disable */
import * as express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'jest';
import * as sinon from 'sinon';
import { SinonSpy, SinonStub } from 'sinon';
import * as supertest from 'supertest';
import { Language } from '../../../veau-entity/Language';
import { Region } from '../../../veau-entity/Region';
import { LocaleUseCase } from '../../../veau-usecase/LocaleUseCase';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { RegionID } from '../../../veau-vo/RegionID';
import { LocaleController } from '../LocaleController';

describe('LocaleController', () => {
  describe('GET /', () => {
    it('returns JSON as LocaleUseCase returns', async () => {
      const stub: SinonStub = sinon.stub();
      const localeUseCase: LocaleUseCase = LocaleUseCase.getInstance();
      localeUseCase.all = stub;
      stub.resolves({
        languages: [
          new Language(LanguageID.of(1), 'language', 'english name', ISO639.of('la'))
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
      const localeUseCase: LocaleUseCase = LocaleUseCase.getInstance();
      localeUseCase.delete = spy;
      const app: express.Express = express();
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(OK);
      expect(spy.called).toEqual(true);
    });

    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      const localeUseCase: LocaleUseCase = LocaleUseCase.getInstance();
      localeUseCase.delete = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });
  });
});
