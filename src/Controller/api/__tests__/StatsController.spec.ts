import bodyParser from 'body-parser';
import express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import supertest from 'supertest';
import { Stats } from '../../../Entity/Stats';
import { StatsItem } from '../../../Entity/StatsItem';
import { StatsItems } from '../../../Entity/StatsItems';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { StatsError } from '../../../Error/StatsError';
import { StatsOutlinesError } from '../../../Error/StatsOutlinesError';
import { Failure } from '../../../General/Try/Failure';
import { Success } from '../../../General/Try/Success';
import { StatsInteractor } from '../../../Interactor/StatsInteractor';
import { AccountName } from '../../../VO/AccountName';
import { AsOf } from '../../../VO/AsOf';
import { ISO3166 } from '../../../VO/ISO3166';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { LanguageID } from '../../../VO/LanguageID';
import { LanguageName } from '../../../VO/LanguageName';
import { NumericalValue } from '../../../VO/NumericalValue';
import { Region } from '../../../VO/Region';
import { RegionID } from '../../../VO/RegionID';
import { RegionName } from '../../../VO/RegionName';
import { StatsID } from '../../../VO/StatsID';
import { StatsItemID } from '../../../VO/StatsItemID';
import { StatsItemName } from '../../../VO/StatsItemName';
import { StatsName } from '../../../VO/StatsName';
import { StatsOutline } from '../../../VO/StatsOutline';
import { StatsOutlines } from '../../../VO/StatsOutlines';
import { StatsUnit } from '../../../VO/StatsUnit';
import { StatsValue } from '../../../VO/StatsValue';
import { StatsValues } from '../../../VO/StatsValues';
import { Term } from '../../../VO/Term';
import { UpdatedAt } from '../../../VO/UpdatedAt';
import { VeauAccount } from '../../../VO/VeauAccount';
import { VeauAccountID } from '../../../VO/VeauAccountID';
import { StatsController } from '../StatsController';

describe('StatsController', () => {
  describe('GET /page/:page(\\d+)', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.findByVeauAccountID = stub;
      const outlines: StatsOutlines = StatsOutlines.ofArray([
        StatsOutline.of(
          StatsID.ofString('01c466f3-198a-45a4-9204-348ac57b1b5d').get(),
          Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
          Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
          Term.DAILY,
          StatsName.of('stats'),
          StatsUnit.of('unit'),
          UpdatedAt.ofString('2000-01-01 00:00:00').get()
        )
      ]);
      stub.resolves(Success.of<StatsOutlines, StatsOutlinesError>(outlines));
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/1');
      expect(response.status).toEqual(OK);
      expect(response.body).toEqual([
        {
          statsID: '01c466f3-198a-45a4-9204-348ac57b1b5d',
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
          },
          termID: 1,
          name: 'stats',
          unit: 'unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ]);
    });

    it('page is 0', async () => {
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/0');
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('replies INTERNAL_SERVER_ERROR', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.findByVeauAccountID = stub;
      stub.resolves(Failure.of<StatsOutlines, StatsOutlinesError>(new StatsOutlinesError('test failed')));
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/1');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /:statsID([0-9a-f\-]{36})', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.findByStatsID = stub;
      const stats: Stats = Stats.of(
        StatsID.ofString('059ce0b2-7cba-4ba4-9a5d-a8fa7493f556').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english name'), ISO639.of('la')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('RGN')),
        Term.DAILY,
        StatsName.of('stats'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.ofArray([
          StatsItem.of(StatsItemID.ofString('09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6').get(), StatsItemName.of('stats item'), StatsValues.ofArray([
            StatsValue.of(StatsItemID.ofString('09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(5))
          ]))
        ])
      );
      stub.resolves(Success.of<Stats, NoSuchElementError>(stats));
      const app: express.Express = express();
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/059ce0b2-7cba-4ba4-9a5d-a8fa7493f556');
      expect(response.status).toEqual(OK);
      expect(response.body).toEqual({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
    });

    it('not found', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.findByStatsID = stub;
      stub.resolves(Failure.of<Stats, NoSuchElementError>(new NoSuchElementError('test failed')));
      const app: express.Express = express();
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/059ce0b2-7cba-4ba4-9a5d-a8fa7493f556');
      expect(response.status).toEqual(NO_CONTENT);
    });

    it('replies INTERNAL_SERVER_ERROR', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.findByStatsID = stub;
      stub.resolves(Failure.of<Stats, NoSuchElementError | StatsError>(new StatsError('test failed')));
      const app: express.Express = express();
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/059ce0b2-7cba-4ba4-9a5d-a8fa7493f556');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });
  });

  describe('POST /', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.resolves();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(CREATED);
    });

    it('replies BAD_REQUEST when the json format is illegal', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: 'this is not uuid',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('statsID is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('language is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('language.languageID is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          name: 'English',
          englishName: 'English',
          iso639: 'en'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('language.name is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          englishName: 'English',
          iso639: 'en'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });
    it('language.englishName is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'English',
          iso639: 'en'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('language.iso639 is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'English',
          englishName: 'English'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('region is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('region.regionID is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'English',
          englishName: 'English',
          iso639: 'en'
        },
        region: {
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('region.name is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'English',
          englishName: 'English',
          iso639: 'en'
        },
        region: {
          regionID: 1,
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('region.iso3166 is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'English',
          englishName: 'English',
          iso639: 'en'
        },
        region: {
          regionID: 1,
          name: 'region'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('termID is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('name is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('unit is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('updatedAt is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('items are missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('item is not plain object', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          'item 1',
          'item 2'
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('item.statsItemID is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('item.name is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            values: [
              {
                asOf: '2000-01-01',
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('item.values are missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item'
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('value is not plain object', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              'value 1',
              'value 2'
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('item.values.asOf is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                value: 5
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('item.values.value is missing', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        // @ts-ignore
        req.user = VeauAccount.of(VeauAccountID.ofString('6ffd502d-e6d9-450c-81c6-05806302ed1b').get(), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).post('/').send({
        statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'la'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'RGN'
        },
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6',
            name: 'stats item',
            values: [
              {
                asOf: '2000-01-01'
              }
            ]
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });
  });
});
