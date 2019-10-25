import express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import supertest from 'supertest';
import { CacheError } from '../../../veau-error/CacheError';
import { LocaleInteractor } from '../../../veau-interactor/LocaleInteractor';
import { AccountName } from '../../../veau-vo/AccountName';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { Languages } from '../../../veau-vo/Languages';
import { Locale } from '../../../veau-vo/Locale';
import { Region } from '../../../veau-vo/Region';
import { RegionID } from '../../../veau-vo/RegionID';
import { RegionName } from '../../../veau-vo/RegionName';
import { Regions } from '../../../veau-vo/Regions';
import { VeauAccount } from '../../../veau-vo/VeauAccount';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { LocaleController } from '../LocaleController';

describe('LocaleController', () => {
  describe('GET /', () => {
    it('returns JSON as LocaleInteractor returns', async () => {
      const stub: SinonStub = sinon.stub();
      LocaleInteractor.prototype.all = stub;
      stub.resolves(Locale.of(
        Languages.of([
          Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english name'), ISO639.of('la'))
        ]),
        Regions.of([
          Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('RGN'))
        ])
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
  });

  describe('DELETE /', () => {
    it('delete all locales of the cache', async () => {
      const spy: SinonSpy = sinon.spy();
      LocaleInteractor.prototype.delete = spy;
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
      stub.rejects(new CacheError('error'));
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', LocaleController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });
  });
});
