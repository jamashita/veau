import { StatsCommand } from '../../Command/MySQL/StatsCommand';
import { StatsItemCommand } from '../../Command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../../Command/MySQL/StatsValueCommand';
import { MockQuery } from '../../General/MySQL/Mock/MockQuery';
import { StatsUpdateFactory } from '../StatsUpdateFactory';

describe('StatsUpdateFactory', () => {
  describe('forgeStatsCommand', () => {
    it('returns StatsCommand instance', () => {
      const query: MockQuery = new MockQuery();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory(query);

      expect(statsUpdateFactory.forgeStatsCommand()).toBeInstanceOf(StatsCommand);
    });
  });

  describe('forgeStatsItemCommand', () => {
    it('returns StatsItemCommand instance', () => {
      const query: MockQuery = new MockQuery();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory(query);

      expect(statsUpdateFactory.forgeStatsItemCommand()).toBeInstanceOf(StatsItemCommand);
    });
  });

  describe('forgeStatsValueCommand', () => {
    it('returns StatsValueCommand instance', () => {
      const query: MockQuery = new MockQuery();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory(query);

      expect(statsUpdateFactory.forgeStatsValueCommand()).toBeInstanceOf(StatsValueCommand);
    });
  });
});
