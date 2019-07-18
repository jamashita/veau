import * as bodyParser from 'body-parser';
import * as express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status';
import 'jest';
import * as moment from 'moment';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import * as supertest from 'supertest';
import { StatsItems } from '../../../veau-entity/collection/StatsItems';
import { StatsOutlines } from '../../../veau-entity/collection/StatsOutlines';
import { Language } from '../../../veau-entity/Language';
import { Region } from '../../../veau-entity/Region';
import { Stats } from '../../../veau-entity/Stats';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { StatsOutline } from '../../../veau-entity/StatsOutline';
import { VeauAccount } from '../../../veau-entity/VeauAccount';
import { Term } from '../../../veau-enum/Term';
import { NotFoundError } from '../../../veau-error/NotFoundError';
import { StatsInteractor } from '../../../veau-interactor/StatsInteractor';
import { AccountName } from '../../../veau-vo/AccountName';
import { StatsValues } from '../../../veau-vo/collection/StatsValues';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { RegionID } from '../../../veau-vo/RegionID';
import { RegionName } from '../../../veau-vo/RegionName';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsItemID } from '../../../veau-vo/StatsItemID';
import { StatsItemName } from '../../../veau-vo/StatsItemName';
import { StatsName } from '../../../veau-vo/StatsName';
import { StatsUnit } from '../../../veau-vo/StatsUnit';
import { StatsValue } from '../../../veau-vo/StatsValue';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { StatsController } from '../StatsController';

describe('StatsController', () => {
  describe('GET /page/:page(\\d+)', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.findByVeauAccountID = stub;
      stub.resolves(StatsOutlines.from([
        StatsOutline.from(
          StatsID.of('01c466f3-198a-45a4-9204-348ac57b1b5d'),
          Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
          Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
          Term.DAILY,
          StatsName.of('stats'),
          StatsUnit.of('unit'),
          moment.utc('2000-01-01 00:00:00')
        )
      ]));
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/0');
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.findByVeauAccountID = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/1');
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    });

    it('illegal access', async () => {
      const app: express.Express = express();
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/1');
      expect(response.status).toEqual(BAD_REQUEST);
    });
  });

  describe('GET /:statsID([0-9a-f\-]{36})', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.findByStatsID = stub;
      stub.resolves(Stats.from(
        StatsID.of('059ce0b2-7cba-4ba4-9a5d-a8fa7493f556'),
        Language.from(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english name'), ISO639.of('la')),
        Region.from(RegionID.of(1), RegionName.of('region'), ISO3166.of('RGN')),
        Term.DAILY,
        StatsName.of('stats'),
        StatsUnit.of('unit'),
        moment.utc('2000-01-01 00:00:00'),
        StatsItems.from([
          StatsItem.from(StatsItemID.of('09c2e4a6-6839-4fbe-858e-bf2c4ee7d5e6'), StatsItemName.of('stats item'), StatsValues.of([
            StatsValue.of(moment.utc('2000-01-01'), 5)
          ]))
        ])
      ));
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
      stub.rejects(new NotFoundError());
      const app: express.Express = express();
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/059ce0b2-7cba-4ba4-9a5d-a8fa7493f556');
      expect(response.status).toEqual(NOT_FOUND);
    });


    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.findByStatsID = stub;
      stub.rejects();
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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

    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      StatsInteractor.prototype.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
      expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
        const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
        const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
        req.user = VeauAccount.from(VeauAccountID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b'), AccountName.of('account'), language, region);
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
