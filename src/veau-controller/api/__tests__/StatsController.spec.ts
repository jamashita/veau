/* tslint:disable */
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } from 'http-status';
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import * as supertest from 'supertest';
import { VeauAccount } from '../../../veau-entity/VeauAccount';
import { NoSuchElementError } from '../../../veau-general/Error/NoSuchElementError';
import { StatsUseCase } from '../../../veau-usecase/StatsUseCase';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { UUID } from '../../../veau-vo/UUID';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { StatsController } from '../StatsController';

describe('StatsController', () => {
  it('GET /overview/:page(\\d+)', async () => {
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

    const response: supertest.Response = await supertest(app).get('/overview/1');
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

  it('GET /overview/:page(\\d+): page is 0', async () => {
    const app: express.Express = express();
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).get('/overview/0');
    expect(response.status).toEqual(PRECONDITION_FAILED);
  });

  it('GET /overview/:page(\\d+): throws error', async () => {
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

    const response: supertest.Response = await supertest(app).get('/overview/1');
    expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
  });

  it('GET /:statsID([0-9a-f\-]{36})', async () => {
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

  it('GET /:statsID([0-9a-f\-]{36}): not found', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.findByStatsID = stub;
    stub.rejects(new NoSuchElementError('059ce0b2-7cba-4ba4-9a5d-a8fa7493f556'));
    const app: express.Express = express();
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).get('/059ce0b2-7cba-4ba4-9a5d-a8fa7493f556');
    expect(response.status).toEqual(NOT_FOUND);
  });


  it('GET /:statsID([0-9a-f\-]{36}): throws error', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.findByStatsID = stub;
    stub.rejects();
    const app: express.Express = express();
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).get('/059ce0b2-7cba-4ba4-9a5d-a8fa7493f556');
    expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
  });

  it('POST /', async () => {
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

  it('POST /: throws error', async () => {
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

  it('POST /: lacks statsID', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.save = stub;
    stub.rejects();
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
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

  it('POST /: lacks language', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.save = stub;
    stub.rejects();
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
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

  it('POST /: lacks region', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.save = stub;
    stub.rejects();
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
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

  it('POST /: lacks termID', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.save = stub;
    stub.rejects();
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
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

  it('POST /: lacks name', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.save = stub;
    stub.rejects();
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
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

  it('POST /: lacks unit', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.save = stub;
    stub.rejects();
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
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

  it('POST /: lacks updatedAt', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.save = stub;
    stub.rejects();
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
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

  it('POST /: lacks items', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.save = stub;
    stub.rejects();
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
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

  it('POST /overview', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.saveNewStats = stub;
    stub.resolves();
    const app: express.Express = express();
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      req.user = new VeauAccount(VeauAccountID.of(UUID.of('6ffd502d-e6d9-450c-81c6-05806302ed1b')), 'account', ISO639.of('ab'), ISO3166.of('AFG'));
      next();
    });
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).post('/overview').send({
      statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
      iso639: 'ab',
      iso3166: 'AFG',
      termID: 1,
      name: 'stats',
      unit: 'unit',
      updatedAt: '2000-01-01 00:00:00'
    });
    expect(response.status).toEqual(CREATED);
  });

  it('POST /overview: throws error', async () => {
    const stub: SinonStub = sinon.stub();
    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    statsUseCase.saveNewStats = stub;
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

    const response: supertest.Response = await supertest(app).post('/overview').send({
      statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
      iso639: 'ab',
      iso3166: 'AFG',
      termID: 1,
      name: 'stats',
      unit: 'unit',
      updatedAt: '2000-01-01 00:00:00'
    });
    expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
  });

  it('POST /overview: lacks statsID', async () => {
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).post('/overview').send({
      iso639: 'ab',
      iso3166: 'AFG',
      termID: 1,
      name: 'stats',
      unit: 'unit',
      updatedAt: '2000-01-01 00:00:00'
    });
    expect(response.status).toEqual(BAD_REQUEST);
  });

  it('POST /overview: lacks iso639', async () => {
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).post('/overview').send({
      statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
      iso3166: 'AFG',
      termID: 1,
      name: 'stats',
      unit: 'unit',
      updatedAt: '2000-01-01 00:00:00'
    });
    expect(response.status).toEqual(BAD_REQUEST);
  });

  it('POST /overview: lacks iso3166', async () => {
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).post('/overview').send({
      statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
      iso639: 'ab',
      termID: 1,
      name: 'stats',
      unit: 'unit',
      updatedAt: '2000-01-01 00:00:00'
    });
    expect(response.status).toEqual(BAD_REQUEST);
  });

  it('POST /overview: lacks termID', async () => {
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).post('/overview').send({
      statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
      iso639: 'ab',
      iso3166: 'AFG',
      name: 'stats',
      unit: 'unit',
      updatedAt: '2000-01-01 00:00:00'
    });
    expect(response.status).toEqual(BAD_REQUEST);
  });

  it('POST /overview: lacks name', async () => {
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).post('/overview').send({
      statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
      iso639: 'ab',
      iso3166: 'AFG',
      termID: 1,
      unit: 'unit',
      updatedAt: '2000-01-01 00:00:00'
    });
    expect(response.status).toEqual(BAD_REQUEST);
  });

  it('POST /overview: lacks unit', async () => {
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).post('/overview').send({
      statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
      iso639: 'ab',
      iso3166: 'AFG',
      termID: 1,
      name: 'stats',
      updatedAt: '2000-01-01 00:00:00'
    });
    expect(response.status).toEqual(BAD_REQUEST);
  });

  it('POST /overview: lacks updatedAt', async () => {
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    app.use('/', StatsController);

    const response: supertest.Response = await supertest(app).post('/overview').send({
      statsID: '059ce0b2-7cba-4ba4-9a5d-a8fa7493f556',
      iso639: 'ab',
      iso3166: 'AFG',
      termID: 1,
      name: 'stats',
      unit: 'unit'
    });
    expect(response.status).toEqual(BAD_REQUEST);
  });
});
