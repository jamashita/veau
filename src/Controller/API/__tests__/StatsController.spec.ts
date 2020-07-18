import 'reflect-metadata';

import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { useContainer, useExpressServer } from 'routing-controllers';
import sinon, { SinonStub } from 'sinon';
import supertest from 'supertest';

import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { MySQLError } from '@jamashita/publikum-mysql';
import { UUID } from '@jamashita/publikum-uuid';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { StatsError } from '../../../Entity/Stats/Error/StatsError';
import { MockStats } from '../../../Entity/Stats/Mock/MockStats';
import { Stats } from '../../../Entity/Stats/Stats';
import { StatsInteractor } from '../../../Interactor/StatsInteractor';
import { NoSuchElementError } from '../../../Query/Error/NoSuchElementError';
import { StatsOutlinesError } from '../../../VO/StatsOutline/Error/StatsOutlinesError';
import { MockStatsOutline } from '../../../VO/StatsOutline/Mock/MockStatsOutline';
import { MockStatsOutlines } from '../../../VO/StatsOutline/Mock/MockStatsOutlines';
import { StatsOutlines } from '../../../VO/StatsOutline/StatsOutlines';
import { Term } from '../../../VO/Term/Term';
import { MockVeauAccount } from '../../../VO/VeauAccount/Mock/MockVeauAccount';
import { StatsController } from '../StatsController';

const fakeAccount = (req: Request, _res: Response, next: NextFunction): void => {
  req.user = new MockVeauAccount();
  next();
};

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

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByVeauAccountID = stub;
      stub.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const app: express.Express = express();

      useContainer(kernel);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get('/stats/page/1');

      expect(response.status).toBe(OK);
      expect(response.body).toEqual(outlines.toJSON());
    });

    it('page is 0', async () => {
      const app: express.Express = express();

      useContainer(kernel);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get('/stats/page/0');

      expect(response.status).toBe(BAD_REQUEST);
    });

    it('replies INTERNAL_SERVER_ERROR', async () => {
      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByVeauAccountID = stub;
      stub.returns(
        Superposition.dead<StatsOutlines, StatsOutlinesError>(new StatsOutlinesError('test failed'), StatsOutlinesError)
      );

      const app: express.Express = express();

      useContainer(kernel);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get('/stats/page/1');

      expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /:statsID([0-9a-f-]{36})', () => {
    it('normal case', async () => {
      const stats: MockStats = new MockStats();

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByStatsID = stub;
      stub.returns(Superposition.alive<Stats, DataSourceError>(stats, DataSourceError));

      const app: express.Express = express();

      useContainer(kernel);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get(`/stats/${UUID.v4().get()}`);

      expect(response.status).toBe(OK);
      expect(response.body).toEqual(stats.toJSON());
    });

    it('replies INTERNAL_SERVER_ERROR because uuid is malformat', async () => {
      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByStatsID = stub;
      stub.returns(
        Superposition.dead<Stats, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError)
      );

      const app: express.Express = express();

      useContainer(kernel);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get('/stats/ffffffffffffffffffffffffffffffffffff');

      expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });

    it('replies INTERNAL_SERVER_ERROR becuase StatsIteractor.findByStatsID() returns Dead', async () => {
      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.findByStatsID = stub;
      stub.returns(Superposition.dead<Stats, StatsError>(new StatsError('test failed'), StatsError));

      const app: express.Express = express();

      useContainer(kernel);
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).get(`/stats/${UUID.v4().get()}`);

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

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.save = stub;
      stub.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const app: express.Express = express();

      useContainer(kernel);
      app.use(
        bodyParser.urlencoded({
          extended: false
        })
      );
      app.use(bodyParser.json());
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).post('/stats').send(stats.toJSON());

      expect(response.status).toBe(CREATED);
    });

    it('replies BAD_REQUEST because request body is malformat', async () => {
      const app: express.Express = express();

      useContainer(kernel);
      app.use(
        bodyParser.urlencoded({
          extended: false
        })
      );
      app.use(bodyParser.json());
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app)
        .post('/stats')
        .send({
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
      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.save = stub;
      stub.returns(Superposition.alive<unknown, DataSourceError>(4, DataSourceError));

      const app: express.Express = express();

      useContainer(kernel);
      app.use(
        bodyParser.urlencoded({
          extended: false
        })
      );
      app.use(bodyParser.json());
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app)
        .post('/stats')
        .send({
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

    it('replies INTERNAL_SERVER_ERROR because StatsIteractor.save() returns Dead', async () => {
      const stats: MockStats = new MockStats({
        outline: new MockStatsOutline({
          termID: Term.ANNUAL.getTermID()
        })
      });

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(Type.StatsInteractor);
      const stub: SinonStub = sinon.stub();

      statsInteractor.save = stub;
      stub.returns(Superposition.dead<unknown, DataSourceError>(new MySQLError('test failed'), DataSourceError));

      const app: express.Express = express();

      useContainer(kernel);
      app.use(
        bodyParser.urlencoded({
          extended: false
        })
      );
      app.use(bodyParser.json());
      app.use(fakeAccount);
      useExpressServer<Express>(app, {
        controllers: [StatsController]
      });

      const response: supertest.Response = await supertest(app).post('/stats').send(stats.toJSON());

      expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });
  });
});
