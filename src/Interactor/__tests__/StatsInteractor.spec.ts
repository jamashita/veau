import { DataSourceError, Dead, MockMySQL, Alive, Superposition } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { MockStats } from '../../Entity/Mock/MockStats';
import { Stats } from '../../Entity/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { MockStatsOutlineQuery } from '../../Query/Mock/MockStatsOutlineQuery';
import { MockStatsQuery } from '../../Query/Mock/MockStatsQuery';
import { MockPage } from '../../VO/Mock/MockPage';
import { MockStatsID } from '../../VO/Mock/MockStatsID';
import { MockStatsOutlines } from '../../VO/Mock/MockStatsOutlines';
import { MockVeauAccountID } from '../../VO/Mock/MockVeauAccountID';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { StatsInteractor } from '../StatsInteractor';

describe('StatsInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsInteractor1: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const statsInteractor2: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);

      expect(statsInteractor1).toBeInstanceOf(StatsInteractor);
      expect(statsInteractor1).toBe(statsInteractor2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const stats: MockStats = new MockStats();

      const mysql: MockMySQL = new MockMySQL();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const stub: SinonStub = sinon.stub();
      statsQuery.findByStatsID = stub;
      stub.resolves(Alive.of<Stats, NoSuchElementError>(stats));

      const statsInteractor: StatsInteractor = new StatsInteractor(
        mysql,
        statsQuery,
        statsOutlineQuery
      );
      const superposition: Superposition<Stats, NoSuchElementError | StatsError | DataSourceError> = await statsInteractor.findByStatsID(statsID);

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get().equals(stats)).toBe(true);
    });

    it('returns Dead when StatsQuery.findByStatsID throws NoSuchElementError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const mysql: MockMySQL = new MockMySQL();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const stub: SinonStub = sinon.stub();
      statsQuery.findByStatsID = stub;
      stub.resolves(Dead.of<Stats, NoSuchElementError>(new NoSuchElementError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsInteractor: StatsInteractor = new StatsInteractor(
        mysql,
        statsQuery,
        statsOutlineQuery
      );
      const superposition: Superposition<Stats, NoSuchElementError | StatsError | DataSourceError> = await statsInteractor.findByStatsID(statsID);

      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | StatsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when StatsQuery.findByStatsID returns Dead<Stats, StatsError>', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const mysql: MockMySQL = new MockMySQL();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const stub: SinonStub = sinon.stub();
      statsQuery.findByStatsID = stub;
      stub.resolves(Dead.of<Stats, StatsError>(new StatsError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsInteractor: StatsInteractor = new StatsInteractor(
        mysql,
        statsQuery,
        statsOutlineQuery
      );
      const superposition: Superposition<Stats, NoSuchElementError | StatsError | DataSourceError> = await statsInteractor.findByStatsID(statsID);

      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | StatsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage();
      const outlines: MockStatsOutlines = new MockStatsOutlines();

      const mysql: MockMySQL = new MockMySQL();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const stub: SinonStub = sinon.stub();
      statsOutlineQuery.findByVeauAccountID = stub;
      stub.resolves(Alive.of<StatsOutlines, StatsOutlinesError>(outlines));

      const statsInteractor: StatsInteractor = new StatsInteractor(
        mysql,
        statsQuery,
        statsOutlineQuery
      );
      const superposition: Superposition<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsInteractor.findByVeauAccountID(
        accountID,
        page
      );

      expect(superposition.get()).toBe(outlines);
    });
  });

  describe('save', () => {
    it('normal case', async () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const stats: MockStats = new MockStats();

      const mysql: MockMySQL = new MockMySQL();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const spy: SinonSpy = sinon.spy();
      mysql.transact = spy;

      const statsInteractor: StatsInteractor = new StatsInteractor(
        mysql,
        statsQuery,
        statsOutlineQuery
      );
      await statsInteractor.save(
        stats,
        accountID
      );

      expect(spy.called).toBe(true);
    });
  });
});
