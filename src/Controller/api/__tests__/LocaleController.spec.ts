import express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import supertest from 'supertest';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { Failure } from '../../../General/Try/Failure';
import { Success } from '../../../General/Try/Success';
import { LocaleInteractor } from '../../../Interactor/LocaleInteractor';
import { AccountName } from '../../../VO/AccountName';
import { ISO3166 } from '../../../VO/ISO3166';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { LanguageID } from '../../../VO/LanguageID';
import { LanguageName } from '../../../VO/LanguageName';
import { Languages } from '../../../VO/Languages';
import { Locale } from '../../../VO/Locale';
import { Region } from '../../../VO/Region';
import { RegionID } from '../../../VO/RegionID';
import { RegionName } from '../../../VO/RegionName';
import { Regions } from '../../../VO/Regions';
import { VeauAccount } from '../../../VO/VeauAccount';
import { VeauAccountID } from '../../../VO/VeauAccountID';
import { LocaleController } from '../LocaleController';
import { RedisError } from '../../../General/Redis/RedisError';
import { DataSourceError } from '../../../General/DataSourceError';

describe('LocaleController', () => {
  describe('GET /', () => {
    it('returns JSON as LocaleInteractor returns', async () => {
      const stub: SinonStub = sinon.stub();
      LocaleInteractor.prototype.all = stub;
      stub.resolves(Success.of<Locale, NoSuchElementError>(
        Locale.of(
          Languages.ofArray([
            Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english name'), ISO639.of('la'))
          ]),
          Regions.ofArray([
            Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('RGN'))
          ])
        )
      ));

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
      const stub: SinonStub = sinon.stub();
      LocaleInteractor.prototype.all = stub;
      stub.resolves(Failure.of<Locale, NoSuchElementError>(new NoSuchElementError('test failed')));

      const app: express.Express = express();
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });
  });

  describe('DELETE /', () => {
    it('delete all locales of the cache', async () => {
      const stub: SinonStub = sinon.stub();
      LocaleInteractor.prototype.delete = stub;
      stub.resolves(Success.of<DataSourceError>());
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(OK);
    });

    it('cache delete error', async () => {
      const stub: SinonStub = sinon.stub();
      LocaleInteractor.prototype.delete = stub;
      stub.resolves(Failure.of<RedisError>(new RedisError('error')));
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });

    it('replies INTERNAL_SERVER_ERROR', async () => {
      const stub: SinonStub = sinon.stub();
      LocaleInteractor.prototype.delete = stub;
      stub.resolves(Failure.of<RedisError>(new RedisError('test failed')));
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });
  });
});
