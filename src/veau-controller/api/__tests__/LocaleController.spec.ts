/* tslint:disable */
import * as express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'jest';
import * as sinon from 'sinon';
import { SinonSpy, SinonStub } from 'sinon';
import * as supertest from 'supertest';
import { LocaleUsecase } from '../../../veau-usecase/LocaleUsecase';
import { LocaleController } from '../LocaleController';

describe('LocaleController', () => {
  it('GET /', async () => {
    const stub: SinonStub = sinon.stub();
    const localeUsecase: LocaleUsecase = LocaleUsecase.getInstance();
    localeUsecase.all = stub;
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

  it('GET /delete', async () => {
    const spy: SinonSpy = sinon.spy();
    const localeUsecase: LocaleUsecase = LocaleUsecase.getInstance();
    localeUsecase.deleteCache = spy;
    const app: express.Express = express();
    app.use('/', LocaleController);

    const response: supertest.Response = await supertest(app).get('/delete');
    expect(response.status).toEqual(OK);
    expect(spy.called).toEqual(true);
  });

  it('GET /delete: throws error', async () => {
    const stub: SinonStub = sinon.stub();
    const localeUsecase: LocaleUsecase = LocaleUsecase.getInstance();
    localeUsecase.deleteCache = stub;
    stub.rejects();
    const app: express.Express = express();
    app.use('/', LocaleController);

    const response: supertest.Response = await supertest(app).get('/delete');
    expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
  });
});
