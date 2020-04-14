import express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import supertest from 'supertest';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { DataSourceError } from '../../../General/DataSourceError';
import { RedisError } from '../../../General/Redis/RedisError';
import { Failure } from '../../../General/Try/Failure';
import { Success } from '../../../General/Try/Success';
import { LocaleInteractor } from '../../../Interactor/LocaleInteractor';
import { Locale } from '../../../VO/Locale';
import { MockISO3166 } from '../../../VO/Mock/MockISO3166';
import { MockISO639 } from '../../../VO/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Mock/MockLanguageID';
import { MockLanguageName } from '../../../VO/Mock/MockLanguageName';
import { MockLanguages } from '../../../VO/Mock/MockLanguages';
import { MockLocale } from '../../../VO/Mock/MockLocale';
import { MockRegion } from '../../../VO/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Mock/MockRegionID';
import { MockRegionName } from '../../../VO/Mock/MockRegionName';
import { MockRegions } from '../../../VO/Mock/MockRegions';
import { AuthenticationMiddleware } from '../../Middleware/AuthenticationMiddleware';
import { LocaleController } from '../LocaleController';

describe('LocaleController', () => {
  describe('GET /', () => {
    it('returns JSON as LocaleInteractor returns', async () => {
      const locale: MockLocale = new MockLocale({
        languages: new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(1),
            name: new MockLanguageName('language'),
            englishName: new MockLanguageName('english name'),
            iso639: new MockISO639('la')
          })
        ),
        regions: new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(1),
            name: new MockRegionName('region'),
            iso3166: new MockISO3166('RGN')
          })
        )
      });

      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const stub: SinonStub = sinon.stub();
      localeInteractor.all = stub;
      stub.resolves(Success.of<Locale, NoSuchElementError | DataSourceError>(locale));

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

    it('returns INTERNAL_SERVER_ERROR when Failure contains NoSuchElementError', async () => {
      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const stub: SinonStub = sinon.stub();
      localeInteractor.all = stub;
      stub.resolves(
        Failure.of<Locale, NoSuchElementError | DataSourceError>(
          new NoSuchElementError('test failed')
        )
      );

      const app: express.Express = express();
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });

    it('returns INTERNAL_SERVER_ERROR when Failure contains DataSourceError', async () => {
      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const stub: SinonStub = sinon.stub();
      localeInteractor.all = stub;
      stub.resolves(
        Failure.of<Locale, NoSuchElementError | DataSourceError>(
          new RedisError('test failed')
        )
      );

      const app: express.Express = express();
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });
  });

  describe('DELETE /', () => {
    it('delete all locales of the cache', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const stub1: SinonStub = sinon.stub();
      authenticationMiddleware.requires = stub1;
      stub1.returns((req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
      });

      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const stub2: SinonStub = sinon.stub();
      localeInteractor.delete = stub2;
      stub2.resolves(Success.of<DataSourceError>());

      const app: express.Express = express();
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(OK);
    });

    it('replies INTERNAL_SERVER_ERROR', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const stub1: SinonStub = sinon.stub();
      authenticationMiddleware.requires = stub1;
      stub1.returns((req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
      });

      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const stub2: SinonStub = sinon.stub();
      localeInteractor.delete = stub2;
      stub2.resolves(Failure.of<DataSourceError>(new RedisError('test failed')));

      const app: express.Express = express();
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });
  });
});
