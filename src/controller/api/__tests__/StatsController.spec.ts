import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MySQLError } from '@jamashita/catacombe-mysql';
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
import { MockStats } from '../../../domain/entity/Stats/mock/MockStats';
import { Stats } from '../../../domain/entity/Stats/Stats';
import { StatsError } from '../../../domain/vo/StatsOutline/error/StatsError';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError';
import { MockStatsOutline } from '../../../domain/vo/StatsOutline/mock/MockStatsOutline';
import { MockStatsOutlines } from '../../../domain/vo/StatsOutline/mock/MockStatsOutlines';
import { StatsOutlines } from '../../../domain/vo/StatsOutline/StatsOutlines';
import { Term } from '../../../domain/vo/Term/Term';
import { MockVeauAccount } from '../../../domain/vo/VeauAccount/mock/MockVeauAccount';
import { StatsInteractor } from '../../../interactor/StatsInteractor';
import { NoSuchElementError } from '../../../repository/query/error/NoSuchElementError';
import { StatsController } from '../StatsController';

const fakeAccount = (req: Request, _res: Response, next: NextFunction): void => {
  req.user = new MockVeauAccount();
  next();
};

describe.skip('StatsController', () => {
  describe('GET /page/:page(\\d+)', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const outlines: MockStatsOutlines = new MockStatsOutlines(
        new MockStatsOutline(),
        new MockStatsOutline(),
        new MockStatsOutline(),
        new MockStatsOutline(),
        new MockStatsOutline()
      );

      const statsInteractor: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByVeauAccountID = stub;
      stub.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const app: express.Express = express();

      useContainer(cask);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get('/stats/page/1');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual(outlines.toJSON());
    });

    it('page is 0', async () => {
      expect.assertions(1);

      const app: express.Express = express();

      useContainer(cask);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get('/stats/page/0').timeout(10_000);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('replies StatusCodes.INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      const statsInteractor: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByVeauAccountID = stub;
      stub.returns(
        Superposition.dead<StatsOutlines, StatsOutlineError>(new StatsOutlineError('test failed'), StatsOutlineError)
      );

      const app: express.Express = express();

      useContainer(cask);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get('/stats/page/1');

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /:statsID([0-9a-f-]{36})', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const stats: MockStats = new MockStats();

      const statsInteractor: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByStatsID = stub;
      stub.returns(Superposition.alive<Stats, DataSourceError>(stats, DataSourceError));

      const app: express.Express = express();

      useContainer(cask);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get(`/stats/${UUID.v4().get()}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual(stats.toJSON());
    });

    it('replies StatusCodes.INTERNAL_SERVER_ERROR because uuid is malformat', async () => {
      expect.assertions(1);

      const statsInteractor: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByStatsID = stub;
      stub.returns(Superposition.dead<Stats, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError));

      const app: express.Express = express();

      useContainer(cask);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get('/stats/ffffffffffffffffffffffffffffffffffff');

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it('replies StatusCodes.NO_CONTENT because StatsIteractor.findByStatsID() returns Dead NoSuchElementError', async () => {
      expect.assertions(1);

      const statsInteractor: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByStatsID = stub;
      stub.returns(Superposition.dead<Stats, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError));

      const app: express.Express = express();

      useContainer(cask);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get(`/stats/${UUID.v4().get()}`);

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('replies StatusCodes.INTERNAL_SERVER_ERROR because StatsIteractor.findByStatsID() returns Dead', async () => {
      expect.assertions(1);

      const statsInteractor: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByStatsID = stub;
      stub.returns(Superposition.dead<Stats, StatsError>(new StatsError('test failed'), StatsError));

      const app: express.Express = express();

      useContainer(cask);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get(`/stats/${UUID.v4().get()}`);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe('POST /', () => {
    it('normal case', async () => {
      expect.assertions(1);

      const stats: MockStats = new MockStats({
        outline: new MockStatsOutline({
          termID: Term.ANNUAL.getTermID()
        })
      });

      const statsInteractor: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.save = stub;
      stub.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const app: express.Express = express();

      useContainer(cask);
      app.use(express.urlencoded({
        extended: false
      }));
      app.use(express.json());
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).post('/stats').send(stats.toJSON());

      expect(response.status).toBe(StatusCodes.CREATED);
    });

    it('replies StatusCodes.BAD_REQUEST because request body is malformat', async () => {
      expect.assertions(1);

      const app: express.Express = express();

      useContainer(cask);
      app.use(express.urlencoded({
        extended: false
      }));
      app.use(express.json());
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).post('/stats').send({
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

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('replies StatusCodes.BAD_REQUEST because UUIDs are malformat', async () => {
      expect.assertions(1);

      const statsInteractor: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.save = stub;
      stub.returns(Superposition.alive<unknown, DataSourceError>(4, DataSourceError));

      const app: express.Express = express();

      useContainer(cask);
      app.use(express.urlencoded({
        extended: false
      }));
      app.use(express.json());
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).post('/stats').send({
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

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('replies StatusCodes.INTERNAL_SERVER_ERROR because StatsIteractor.save() returns Dead', async () => {
      expect.assertions(1);

      const stats: MockStats = new MockStats({
        outline: new MockStatsOutline({
          termID: Term.ANNUAL.getTermID()
        })
      });

      const statsInteractor: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.save = stub;
      stub.returns(Superposition.dead<unknown, DataSourceError>(new MySQLError('test failed'), DataSourceError));

      const app: express.Express = express();

      useContainer(cask);
      app.use(express.urlencoded({
        extended: false
      }));
      app.use(express.json());
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).post('/stats').send(stats.toJSON());

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
