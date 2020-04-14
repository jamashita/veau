import { StatsCommand } from '../../Command/MySQL/StatsCommand';
import { StatsItemCommand } from '../../Command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../../Command/MySQL/StatsValueCommand';
import { MockQuery } from '../../General/MySQL/Mock/MockQuery';
import { StatsUpdateFactory } from '../StatsUpdateFactory';

describe('StatsUpdateFactory', () => {
  describe('forgeStatsCommand', () => {
    it('returns StatsCommand instance', () => {
      const query: MockQuery = new MockQuery();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory();

      expect(statsUpdateFactory.forgeStatsCommand(query)).toBeInstanceOf(StatsCommand);
    });
  });

  describe('forgeStatsItemCommand', () => {
    it('returns StatsItemCommand instance', () => {
      const query: MockQuery = new MockQuery();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory();

      expect(statsUpdateFactory.forgeStatsItemCommand(query)).toBeInstanceOf(StatsItemCommand);
    });
  });

  describe('forgeStatsValueCommand', () => {
    it('returns StatsValueCommand instance', () => {
      const query: MockQuery = new MockQuery();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory(

      );

      expect(statsUpdateFactory.forgeStatsValueCommand(query)).toBeInstanceOf(StatsValueCommand);
    });
  });
});
