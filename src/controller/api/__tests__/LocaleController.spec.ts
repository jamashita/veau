import { DataSourceError } from '@jamashita/catacombe-datasource';
import { RedisError } from '@jamashita/catacombe-redis';
import { Superposition } from '@jamashita/genitore';
import express, { Express } from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import sinon, { SinonStub } from 'sinon';
import supertest from 'supertest';
import { cask } from '../../../container/Cask';
import { Type } from '../../../container/Types';
import { MockISO639 } from '../../../domain/vo/Language/mock/MockISO639';
import { MockLanguage } from '../../../domain/vo/Language/mock/MockLanguage';
import { MockLanguageID } from '../../../domain/vo/Language/mock/MockLanguageID';
import { MockLanguageName } from '../../../domain/vo/Language/mock/MockLanguageName';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { MockLocale } from '../../../domain/vo/Locale/mock/MockLocale';
import { MockISO3166 } from '../../../domain/vo/Region/mock/MockISO3166';
import { MockRegion } from '../../../domain/vo/Region/mock/MockRegion';
import { MockRegionID } from '../../../domain/vo/Region/mock/MockRegionID';
import { MockRegionName } from '../../../domain/vo/Region/mock/MockRegionName';
import { MockVeauAccount } from '../../../domain/vo/VeauAccount/mock/MockVeauAccount';
import { LocaleInteractor } from '../../../interactor/LocaleInteractor';
import { NoSuchElementError } from '../../../repository/query/error/NoSuchElementError';
import { LocaleController } from '../LocaleController';

const fakeAccount = (req: Request, _res: Response, next: NextFunction): void => {
  req.user = new MockVeauAccount();
  next();
};

describe.skip('LocaleController', () => {
  describe('GET /', () => {
    it('returns JSON as LocaleInteractor returns', async () => {
      expect.assertions(2);

      const locale: MockLocale = new MockLocale({
        languages: [
          new MockLanguage({
            languageID: new MockLanguageID(),
            name: new MockLanguageName('language'),
            englishName: new MockLanguageName('english name'),
            iso639: new MockISO639('la')
          })
        ],
        regions: [
          new MockRegion({
            regionID: new MockRegionID(),
            name: new MockRegionName('region'),
            iso3166: new MockISO3166('RGN')
          })
        ]
      });

      const localeInteractor: LocaleInteractor = cask.get<LocaleInteractor>(Type.LocaleInteractor);
      const stub: SinonStub = sinon.stub();

      localeInteractor.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const app: Express = express();

      useContainer(cask);
      useExpressServer<Express>(app, {
        controllers: [LocaleController]
      });

      const response: supertest.Response = await supertest(app).get('/locale');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual(locale.toJSON());
    });

    it('returns StatusCodes.INTERNAL_SERVER_ERROR when Dead contains NoSuchElementError', async () => {
      expect.assertions(1);

      const localeInteractor: LocaleInteractor = cask.get<LocaleInteractor>(Type.LocaleInteractor);
      const stub: SinonStub = sinon.stub();

      localeInteractor.all = stub;
      stub.returns(
        Superposition.dead<Locale, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError)
      );

      const app: Express = express();

      useContainer(cask);
      useExpressServer<Express>(app, {
        controllers: [LocaleController]
      });

      const response: supertest.Response = await supertest(app).get('/locale').timeout(10_000);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it('returns StatusCodes.INTERNAL_SERVER_ERROR when Dead contains DataSourceError', async () => {
      expect.assertions(1);

      const localeInteractor: LocaleInteractor = cask.get<LocaleInteractor>(Type.LocaleInteractor);
      const stub: SinonStub = sinon.stub();

      localeInteractor.all = stub;
      stub.returns(Superposition.dead<Locale, DataSourceError>(new RedisError('test failed'), DataSourceError));

      const app: Express = express();

      useContainer(cask);
      useExpressServer<Express>(app, {
        controllers: [LocaleController]
      });

      const response: supertest.Response = await supertest(app).get('/locale').timeout(10_000);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe('DELETE /', () => {
    it('delete all locales of the cache', async () => {
      expect.assertions(1);

      const localeInteractor: LocaleInteractor = cask.get<LocaleInteractor>(Type.LocaleInteractor);
      const stub: SinonStub = sinon.stub();

      localeInteractor.delete = stub;
      stub.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const app: Express = express();

      useContainer(cask);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [LocaleController]
      });

      const response: supertest.Response = await supertest(app).delete('/locale').timeout(10_000);

      expect(response.status).toBe(StatusCodes.OK);
    });

    it('replies StatusCodes.INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      const localeInteractor: LocaleInteractor = cask.get<LocaleInteractor>(Type.LocaleInteractor);
      const stub: SinonStub = sinon.stub();

      localeInteractor.delete = stub;
      stub.returns(Superposition.dead<unknown, DataSourceError>(new RedisError('test failed'), DataSourceError));

      const app: Express = express();

      useContainer(cask);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [LocaleController]
      });

      const response: supertest.Response = await supertest(app).delete('/locale');

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
