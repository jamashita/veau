import { INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import { AJAXError, DataSourceError, MockAJAX, Superposition, UUID } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { Stats, StatsJSON } from '../../../Entity/Stats';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { StatsError } from '../../../Error/StatsError';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsQuery1: StatsQuery = vault.get<StatsQuery>(TYPE.StatsAJAXQuery);
      const statsQuery2: StatsQuery = vault.get<StatsQuery>(TYPE.StatsAJAXQuery);

      expect(statsQuery1).toBeInstanceOf(StatsQuery);
      expect(statsQuery1).toBe(statsQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const json: StatsJSON = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 3,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-01 00:00:00',
        items: []
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const statsQuery: StatsQuery = new StatsQuery(ajax);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(stub.withArgs(`/api/stats/${statsID.get().get()}`).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const stats: Stats = superposition.get();
      expect(stats.getStatsID().get().get()).toBe(json.statsID);
      expect(stats.getLanguageID().get().get()).toBe(json.languageID);
      expect(stats.getRegionID().get().get()).toBe(json.regionID);
      expect(stats.getTerm().getID()).toBe(json.termID);
      expect(stats.getName().get()).toBe(json.name);
      expect(stats.getUnit().get()).toBe(json.unit);
      expect(stats.getItems().size()).toBe(0);
    });

    it('returns Dead when it has wrong format statsID', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const json: StatsJSON = {
        statsID: 'malformat uuid',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 3,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-01 00:00:00',
        items: []
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(ajax);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns NO_CONTENT', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: NO_CONTENT,
        body: {}
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(ajax);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('doesn\'t return OK', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {}
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(ajax);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
