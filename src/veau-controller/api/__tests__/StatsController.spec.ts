/* tslint:disable */
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status';
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import * as supertest from 'supertest';
import { VeauAccount } from '../../../veau-entity/VeauAccount';
import { NotFoundError } from '../../../veau-error/NotFoundError';
import { StatsUseCase } from '../../../veau-usecase/StatsUseCase';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { UUID } from '../../../veau-vo/UUID';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { StatsController } from '../StatsController';

describe('StatsController', () => {
  describe('GET /page/:page(\\d+)', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.findByVeauAccountID = stub;
      stub.resolves([
        {
          statsID: '01c466f3-198a-45a4-9204-348ac57b1b5d',
          iso639: 'ab',
          iso3166: 'AFG',
          termID: 1,
          name: 'stats',
          unit: 'unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ]);
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/1');
      expect(response.status).toEqual(OK);
      expect(response.body).toEqual([
        {
          statsID: '01c466f3-198a-45a4-9204-348ac57b1b5d',
          iso639: 'ab',
          iso3166: 'AFG',
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
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
        next();
      });
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/page/0');
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.findByVeauAccountID = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.findByStatsID = stub;
      stub.resolves({
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.findByStatsID = stub;
      stub.rejects(new NotFoundError());
      const app: express.Express = express();
      app.use('/', StatsController);

      const response: supertest.Response = await supertest(app).get('/059ce0b2-7cba-4ba4-9a5d-a8fa7493f556');
      expect(response.status).toEqual(NOT_FOUND);
    });


    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.findByStatsID = stub;
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.resolves();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
          }
        ]
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    it('item.value.asOf is missing', async () => {
      const stub: SinonStub = sinon.stub();
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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

    it('item.value.value is missing', async () => {
      const stub: SinonStub = sinon.stub();
      const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
      statsUseCase.save = stub;
      stub.rejects();
      const app: express.Express = express();
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.use(bodyParser.json());
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
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
