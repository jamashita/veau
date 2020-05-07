import bodyParser from 'body-parser';
import express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import { Alive, DataSourceError, Dead, MySQLError, UUID } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import supertest from 'supertest';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { MockStats } from '../../../Entity/Mock/MockStats';
import { Stats } from '../../../Entity/Stats';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { StatsError } from '../../../Error/StatsError';
import { StatsOutlinesError } from '../../../Error/StatsOutlinesError';
import { StatsInteractor } from '../../../Interactor/StatsInteractor';
import { MockStatsOutline } from '../../../VO/Mock/MockStatsOutline';
import { MockStatsOutlines } from '../../../VO/Mock/MockStatsOutlines';
import { MockVeauAccount } from '../../../VO/Mock/MockVeauAccount';
import { StatsOutlines } from '../../../VO/StatsOutlines';
import { Term } from '../../../VO/Term';
import { StatsController } from '../StatsController';

describe('StatsController', () => {
  describe('GET /page/:page(\\d+)', () => {
    it('normal case', async () => {
      const outlines: MockStatsOutlines = new MockStatsOutlines(
        new MockStatsOutline(),
        new MockStatsOutline(),
        new MockStatsOutline(),
        new MockStatsOutline(),
        new MockStatsOutline()
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
      const stats: MockStats = new MockStats();

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

    it('replies NO_CONTENT', async () => {
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
      const stats: MockStats = new MockStats({
        outline: new MockStatsOutline({
          termID: Term.ANNUAL.getTermID()
        })
      });

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const stub: SinonStub = sinon.stub();
      statsInteractor.save = stub;
      stub.resolves(Alive.of<DataSourceError>());

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

      const response: supertest.Response = await supertest(app).post('/').send(stats.toJSON());
      expect(response.status).toBe(CREATED);
    });

    it('replies BAD_REQUEST because request body is malformat', async () => {
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
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'name',
          unit: 'unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      });
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('replies BAD_REQUEST because UUIDs are malformat', async () => {
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
        outline: {
          statsID: 'illgal',
          languageID: 'illgal',
          regionID: 'illgal',
          termID: 'illgal',
          name: 'name',
          unit: 'unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: 'illgal',
          name: 'language',
          englishName: 'english language',
          iso639: 'DU'
        },
        region: {
          regionID: 'illgal',
          name: 'region',
          iso3166: 'IDE'
        },
        items: []
      });
      expect(response.status).toBe(BAD_REQUEST);
    });

    it('replies INTERNAL_SERVER_ERROR', async () => {
      const stats: MockStats = new MockStats({
        outline: new MockStatsOutline({
          termID: Term.ANNUAL.getTermID()
        })
      });

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const stub: SinonStub = sinon.stub();
      statsInteractor.save = stub;
      stub.resolves(Dead.of<DataSourceError>(new MySQLError('test failed')));

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

      const response: supertest.Response = await supertest(app).post('/').send(stats.toJSON());
      expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });
  });
});
