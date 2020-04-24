import bodyParser from 'body-parser';
import express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import { DataSourceError, Dead, Alive, UUID } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import supertest from 'supertest';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { MockStats } from '../../../Entity/Mock/MockStats';
import { MockStatsItem } from '../../../Entity/Mock/MockStatsItem';
import { MockStatsItems } from '../../../Entity/Mock/MockStatsItems';
import { Stats } from '../../../Entity/Stats';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { StatsError } from '../../../Error/StatsError';
import { StatsOutlinesError } from '../../../Error/StatsOutlinesError';
import { StatsInteractor } from '../../../Interactor/StatsInteractor';
import { MockAsOf } from '../../../VO/Mock/MockAsOf';
import { MockISO3166 } from '../../../VO/Mock/MockISO3166';
import { MockISO639 } from '../../../VO/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Mock/MockLanguageID';
import { MockLanguageName } from '../../../VO/Mock/MockLanguageName';
import { MockNumericalValue } from '../../../VO/Mock/MockNumericalValue';
import { MockRegion } from '../../../VO/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Mock/MockRegionID';
import { MockRegionName } from '../../../VO/Mock/MockRegionName';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { MockStatsItemID } from '../../../VO/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../../VO/Mock/MockStatsItemName';
import { MockStatsName } from '../../../VO/Mock/MockStatsName';
import { MockStatsOutline } from '../../../VO/Mock/MockStatsOutline';
import { MockStatsOutlines } from '../../../VO/Mock/MockStatsOutlines';
import { MockStatsUnit } from '../../../VO/Mock/MockStatsUnit';
import { MockStatsValue } from '../../../VO/Mock/MockStatsValue';
import { MockStatsValues } from '../../../VO/Mock/MockStatsValues';
import { MockTerm } from '../../../VO/Mock/MockTerm';
import { MockUpdatedAt } from '../../../VO/Mock/MockUpdatedAt';
import { MockVeauAccount } from '../../../VO/Mock/MockVeauAccount';
import { StatsOutlines } from '../../../VO/StatsOutlines';
import { StatsController } from '../StatsController';

describe('StatsController', () => {
  describe('GET /page/:page(\\d+)', () => {
    it('normal case', async () => {
      const outlines: MockStatsOutlines = new MockStatsOutlines(
        new MockStatsOutline({
          statsID: new MockStatsID(),
          language: new MockLanguage({
            languageID: new MockLanguageID(1),
            name: new MockLanguageName('аҧсуа бызшәа'),
            englishName: new MockLanguageName('Abkhazian'),
            iso639: new MockISO639('ab')
          }),
          region: new MockRegion({
            regionID: new MockRegionID(1),
            name: new MockRegionName('Afghanistan'),
            iso3166: new MockISO3166('AFG')
          }),
          term: new MockTerm({
            id: 32
          }),
          name: new MockStatsName('stats'),
          unit: new MockStatsUnit('unit'),
          updatedAt: new MockUpdatedAt({
            day: 2
          })
        })
      );

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const stub: SinonStub = sinon.stub();
      statsInteractor.findByVeauAccountID = stub;
      stub.resolves(Alive.of<StatsOutlines, StatsOutlinesError>(outlines));

      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/1');
      expect(response.status).toBe(OK);
      expect(response.body).toEqual(outlines.toJSON());
    });

    it('page is 0', async () => {
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/0');
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('replies INTERNAL_SERVER_ERROR', async () => {
      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const stub: SinonStub = sinon.stub();
      statsInteractor.findByVeauAccountID = stub;
      stub.resolves(Dead.of<StatsOutlines, StatsOutlinesError>(new StatsOutlinesError('test failed')));

      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/1');
      expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /:statsID([0-9a-f\-]{36})', () => {
    it('normal case', async () => {
      const stats: MockStats = new MockStats({
        statsID: new MockStatsID(),
        language: new MockLanguage({
          languageID: new MockLanguageID(1),
          name: new MockLanguageName('language'),
          englishName: new MockLanguageName('english name'),
          iso639: new MockISO639('la')
        }),
        region: new MockRegion({
          regionID: new MockRegionID(1),
          name: new MockRegionName('region'),
          iso3166: new MockISO3166('RGN')
        }),
        term: new MockTerm({
          id: 32
        }),
        name: new MockStatsName('stats'),
        unit: new MockStatsUnit('unit'),
        updatedAt: new MockUpdatedAt({
          day: 2
        }),
        items: new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(),
            name: new MockStatsItemName('stats item'),
            values: new MockStatsValues(
              new MockStatsValue({
                statsItemID: new MockStatsItemID(),
                asOf: new MockAsOf({
                  day: 5
                }),
                value: new MockNumericalValue(5)
              })
            )
          })
        )
      });

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const stub: SinonStub = sinon.stub();
      statsInteractor.findByStatsID = stub;
      stub.resolves(Alive.of<Stats, NoSuchElementError>(stats));

      const app: express.Express = express();
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get(`/${UUID.v4()}`);
      expect(response.status).toBe(OK);
      expect(response.body).toEqual(stats.toJSON());
    });

    it('not found', async () => {
      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const stub: SinonStub = sinon.stub();
      statsInteractor.findByStatsID = stub;
      stub.resolves(Dead.of<Stats, NoSuchElementError>(new NoSuchElementError('test failed')));

      const app: express.Express = express();
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get(`/${UUID.v4()}`);
      expect(response.status).toBe(NO_CONTENT);
    });

    it('replies INTERNAL_SERVER_ERROR', async () => {
      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const stub: SinonStub = sinon.stub();
      statsInteractor.findByStatsID = stub;
      stub.resolves(Dead.of<Stats, NoSuchElementError | StatsError>(new StatsError('test failed')));

      const app: express.Express = express();
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get(`/${UUID.v4()}`);
      expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });
  });

  describe('POST /', () => {
    it('normal case', async () => {
      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const stub: SinonStub = sinon.stub();
      statsInteractor.save = stub;
      stub.resolves(Alive.of<unknown, DataSourceError>(4));

      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(CREATED);
    });

    it('replies BAD_REQUEST when the json format is illegal', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('statsID is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('language is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('language.languageID is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('language.name is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('language.englishName is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('language.iso639 is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('region is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('region.regionID is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('region.name is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('region.iso3166 is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('termID is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('name is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('unit is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('updatedAt is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('items are missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('item is not plain object', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('item.statsItemID is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('item.name is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('item.values are missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('value is not plain object', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('item.values.asOf is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('item.values.value is missing', async () => {
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new MockVeauAccount();
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
      expect(response.status).toBe(BAD_REQUEST);
    });
  });
});
