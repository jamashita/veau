import 'reflect-metadata';

import { Alive, DataSourceError, Superposition } from 'publikum';
import sinon, { SinonStub } from 'sinon';

import { MockStatsCommand } from '../../Command/Mock/MockStatsCommand';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { MockStats } from '../../Entity/Mock/MockStats';
import { Stats } from '../../Entity/Stats/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { MockStatsOutlineQuery } from '../../Query/Mock/MockStatsOutlineQuery';
import { MockStatsQuery } from '../../Query/Mock/MockStatsQuery';
import { MockPage } from '../../VO/Page/Mock/MockPage';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
import { MockStatsID } from '../../VO/StatsOutline/Mock/MockStatsID';
import { MockStatsOutlines } from '../../VO/StatsOutline/Mock/MockStatsOutlines';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { MockVeauAccountID } from '../../VO/VeauAccount/Mock/MockVeauAccountID';
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

      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub: SinonStub = sinon.stub();
      statsQuery.findByStatsID = stub;
      stub.resolves(Alive.of<Stats, NoSuchElementError>(stats));

      const statsInteractor: StatsInteractor = new StatsInteractor(statsQuery, statsOutlineQuery, statsCommand);
      const superposition: Superposition<
        Stats,
        NoSuchElementError | StatsError | DataSourceError
      > = await statsInteractor.findByStatsID(statsID);

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get().equals(stats)).toBe(true);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage();
      const outlines: MockStatsOutlines = new MockStatsOutlines();

      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub: SinonStub = sinon.stub();
      statsOutlineQuery.findByVeauAccountID = stub;
      stub.resolves(Alive.of<StatsOutlines, StatsOutlinesError>(outlines));

      const statsInteractor: StatsInteractor = new StatsInteractor(statsQuery, statsOutlineQuery, statsCommand);
      const superposition: Superposition<
        StatsOutlines,
        StatsOutlinesError | DataSourceError
      > = await statsInteractor.findByVeauAccountID(accountID, page);

      expect(superposition.get()).toBe(outlines);
    });
  });

  describe('save', () => {
    it('normal case', async () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const stats: MockStats = new MockStats();

      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub: SinonStub = sinon.stub();
      statsCommand.create = stub;
      stub.resolves(Alive.of<unknown, DataSourceError>('something'));

      const statsInteractor: StatsInteractor = new StatsInteractor(statsQuery, statsOutlineQuery, statsCommand);
      await statsInteractor.save(stats, accountID);

      expect(stub.called).toBe(true);
    });
  });
});
