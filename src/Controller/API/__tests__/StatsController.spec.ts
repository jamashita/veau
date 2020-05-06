import bodyParser from 'body-parser';
import express from 'express';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import { Alive, DataSourceError, Dead, UUID } from 'publikum';
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
import { MockLanguageID } from '../../../VO/Mock/MockLanguageID';
import { MockNumericalValue } from '../../../VO/Mock/MockNumericalValue';
import { MockRegionID } from '../../../VO/Mock/MockRegionID';
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
          languageID: new MockLanguageID(),
          regionID: new MockRegionID(),
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
        languageID: new MockLanguageID(),
        regionID: new MockRegionID(),
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
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: UUID.v4().get(),
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
  });
});
