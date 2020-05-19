import 'reflect-metadata';

import express, { Express, NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { Alive, DataSourceError, Dead, RedisError } from 'publikum';
import { useExpressServer } from 'routing-controllers';
import sinon, { SinonStub } from 'sinon';
import supertest from 'supertest';

import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { NoSuchElementError } from '../../../Query/Error/NoSuchElementError';
import { LocaleInteractor } from '../../../Interactor/LocaleInteractor';
import { MockISO639 } from '../../../VO/Language/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Language/Mock/MockLanguageID';
import { MockLanguageName } from '../../../VO/Language/Mock/MockLanguageName';
import { MockLanguages } from '../../../VO/Language/Mock/MockLanguages';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { MockISO3166 } from '../../../VO/Region/Mock/MockISO3166';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { MockRegionName } from '../../../VO/Region/Mock/MockRegionName';
import { MockRegions } from '../../../VO/Region/Mock/MockRegions';
import { MockVeauAccount } from '../../../VO/VeauAccount/Mock/MockVeauAccount';
import { LocaleController } from '../LocaleController';

const fakeAccount = (req: Request, res: Response, next: NextFunction) => {
  req.user = new MockVeauAccount();
  next();
};

describe('LocaleController', () => {
  describe('GET /', () => {
    it('returns JSON as LocaleInteractor returns', async () => {
      const locale: MockLocale = new MockLocale({
        languages: new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(),
            name: new MockLanguageName('language'),
            englishName: new MockLanguageName('english name'),
            iso639: new MockISO639('la')
          })
        ),
        regions: new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(),
            name: new MockRegionName('region'),
            iso3166: new MockISO3166('RGN')
          })
        )
      });

      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const stub: SinonStub = sinon.stub();
      localeInteractor.all = stub;
      stub.resolves(Alive.of<Locale, NoSuchElementError | DataSourceError>(locale));

      const app: Express = express();
      useExpressServer(app, {
        controllers: [LocaleController]
      });

      const response: supertest.Response = await supertest(app).get('/locale');
      expect(response.status).toBe(OK);
      expect(response.body).toEqual(locale.toJSON());
    });

    it('returns INTERNAL_SERVER_ERROR when Dead contains NoSuchElementError', async () => {
      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const stub: SinonStub = sinon.stub();
      localeInteractor.all = stub;
      stub.resolves(Dead.of<Locale, NoSuchElementError | DataSourceError>(new NoSuchElementError('test failed')));

      const app: Express = express();
      useExpressServer(app, {
        controllers: [LocaleController]
      });

      const response: supertest.Response = await supertest(app).get('/locale');
      expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });

    it('returns INTERNAL_SERVER_ERROR when Dead contains DataSourceError', async () => {
      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const stub: SinonStub = sinon.stub();
      localeInteractor.all = stub;
      stub.resolves(Dead.of<Locale, NoSuchElementError | DataSourceError>(new RedisError('test failed')));

      const app: Express = express();
      useExpressServer(app, {
        controllers: [LocaleController]
      });

      const response: supertest.Response = await supertest(app).get('/locale');
      expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });
  });

  describe('DELETE /', () => {
    it('delete all locales of the cache', async () => {
      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const stub: SinonStub = sinon.stub();
      localeInteractor.delete = stub;
      stub.resolves(Alive.of<DataSourceError>());

      const app: Express = express();
      app.use(fakeAccount);
      useExpressServer(app, {
        controllers: [LocaleController]
      });

      const response: supertest.Response = await supertest(app).delete('/locale');
      expect(response.status).toBe(OK);
    });

    it('replies INTERNAL_SERVER_ERROR', async () => {
      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const stub: SinonStub = sinon.stub();
      localeInteractor.delete = stub;
      stub.resolves(Dead.of<DataSourceError>(new RedisError('test failed')));

      const app: Express = express();
      app.use(fakeAccount);
      useExpressServer(app, {
        controllers: [LocaleController]
      });

      const response: supertest.Response = await supertest(app).delete('/locale');
      expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });
  });
});
