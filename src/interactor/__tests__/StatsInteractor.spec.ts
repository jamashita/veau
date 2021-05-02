import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { cask } from '../../container/Cask';
import { Type } from '../../container/Types';
import { MockStats } from '../../domain/entity/Stats/mock/MockStats';
import { Stats } from '../../domain/entity/Stats/Stats';
import { MockPage } from '../../domain/vo/Page/mock/MockPage';
import { StatsError } from '../../domain/vo/StatsOutline/error/StatsError';
import { StatsOutlineError } from '../../domain/vo/StatsOutline/error/StatsOutlineError';
import { MockStatsID } from '../../domain/vo/StatsOutline/mock/MockStatsID';
import { MockStatsOutlines } from '../../domain/vo/StatsOutline/mock/MockStatsOutlines';
import { StatsOutlines } from '../../domain/vo/StatsOutline/StatsOutlines';
import { MockVeauAccountID } from '../../domain/vo/VeauAccount/mock/MockVeauAccountID';
import { MockStatsCommand } from '../../repository/command/mock/MockStatsCommand';
import { NoSuchElementError } from '../../repository/query/error/NoSuchElementError';
import { MockStatsOutlineQuery } from '../../repository/query/mock/MockStatsOutlineQuery';
import { MockStatsQuery } from '../../repository/query/mock/MockStatsQuery';
import { StatsInteractor } from '../StatsInteractor';

describe('StatsInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsInteractor1: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);
      const statsInteractor2: StatsInteractor = cask.get<StatsInteractor>(Type.StatsInteractor);

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
