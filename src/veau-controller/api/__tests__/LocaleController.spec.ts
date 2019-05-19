/* tslint:disable */
import * as express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'jest';
import * as sinon from 'sinon';
import { SinonSpy, SinonStub } from 'sinon';
import * as supertest from 'supertest';
import { LocaleUseCase } from '../../../veau-usecase/LocaleUseCase';
import { LocaleController } from '../LocaleController';

describe('LocaleController', () => {
  describe('GET /', () => {
    it('returns JSON as LocaleUseCase returns', async () => {
      const stub: SinonStub = sinon.stub();
      const localeUseCase: LocaleUseCase = LocaleUseCase.getInstance();
      localeUseCase.all = stub;
      stub.resolves({
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
