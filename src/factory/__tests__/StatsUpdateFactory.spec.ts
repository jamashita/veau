import { MockSQL } from '@jamashita/catacombe-mysql';
import { StatsCommand } from '../../repository/command/MySQL/StatsCommand';
import { StatsItemCommand } from '../../repository/command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../../repository/command/MySQL/StatsValueCommand';
import { StatsUpdateFactory } from '../StatsUpdateFactory';

describe('StatsUpdateFactory', () => {
  describe('forgeStatsCommand', () => {
    it('returns StatsCommand instance', () => {
      expect.assertions(1);

      const sql: MockSQL = new MockSQL();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory();

      expect(statsUpdateFactory.forgeStatsCommand(sql)).toBeInstanceOf(StatsCommand);
    });
  });

  describe('forgeStatsItemCommand', () => {
    it('returns StatsItemCommand instance', () => {
      expect.assertions(1);

      const sql: MockSQL = new MockSQL();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory();

      expect(statsUpdateFactory.forgeStatsItemCommand(sql)).toBeInstanceOf(StatsItemCommand);
    });
  });

  describe('forgeStatsValueCommand', () => {
    it('returns StatsValueCommand instance', () => {
      expect.assertions(1);

      const sql: MockSQL = new MockSQL();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory();

      expect(statsUpdateFactory.forgeStatsValueCommand(sql)).toBeInstanceOf(StatsValueCommand);
    });
  });
});
