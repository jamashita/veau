import { DataSourceError } from '@jamashita/anden-error';
import { Schrodinger, Superposition } from '@jamashita/genitore-superposition';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { MockStatsCommand } from '../../Command/Mock/MockStatsCommand';
import { kernel } from '../../Container/Kernel';
import { Type } from '../../Container/Types';
import { MockStats } from '../../Entity/Stats/Mock/MockStats';
import { Stats } from '../../Entity/Stats/Stats';
import { NoSuchElementError } from '../../Query/Error/NoSuchElementError';
import { MockStatsOutlineQuery } from '../../Query/Mock/MockStatsOutlineQuery';
import { MockStatsQuery } from '../../Query/Mock/MockStatsQuery';
import { MockPage } from '../../VO/Page/Mock/MockPage';
import { StatsError } from '../../VO/StatsOutline/Error/StatsError';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { MockStatsID } from '../../VO/StatsOutline/Mock/MockStatsID';
import { MockStatsOutlines } from '../../VO/StatsOutline/Mock/MockStatsOutlines';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { MockVeauAccountID } from '../../VO/VeauAccount/Mock/MockVeauAccountID';
import { StatsInteractor } from '../StatsInteractor';

describe('StatsInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsInteractor1: StatsInteractor = kernel.get<StatsInteractor>(Type.StatsInteractor);
      const statsInteractor2: StatsInteractor = kernel.get<StatsInteractor>(Type.StatsInteractor);

      expect(statsInteractor1).toBeInstanceOf(StatsInteractor);
      expect(statsInteractor1).toBe(statsInteractor2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();
      const stats: MockStats = new MockStats();

      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub: SinonStub = sinon.stub();

      statsQuery.findByStatsID = stub;
      stub.returns(Superposition.alive<Stats, DataSourceError>(stats, DataSourceError));

      const statsInteractor: StatsInteractor = new StatsInteractor(statsQuery, statsOutlineQuery, statsCommand);
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsInteractor.findByStatsID(statsID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().equals(stats)).toBe(true);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage();
      const outlines: MockStatsOutlines = new MockStatsOutlines();

      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub;
      stub.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const statsInteractor: StatsInteractor = new StatsInteractor(statsQuery, statsOutlineQuery, statsCommand);
      const schrodinger: Schrodinger<StatsOutlines, DataSourceError | StatsOutlineError> = await statsInteractor.findByVeauAccountID(accountID, page).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(outlines);
    });
  });

  describe('save', () => {
    it('normal case', async () => {
      expect.assertions(1);

      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const stats: MockStats = new MockStats();

      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub: SinonStub = sinon.stub();

      statsCommand.create = stub;
      stub.returns(Superposition.alive<unknown, DataSourceError>('something', DataSourceError));

      const statsInteractor: StatsInteractor = new StatsInteractor(statsQuery, statsOutlineQuery, statsCommand);

      await statsInteractor.save(stats, accountID).terminate();

      expect(stub.called).toBe(true);
    });
  });
});
