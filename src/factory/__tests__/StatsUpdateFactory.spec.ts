import { MockSQL } from '@jamashita/catacombe-mysql';
import { StatsItemMySQLCommand } from '../../repository/command/mysql/StatsItemMySQLCommand';
import { StatsMySQLCommand } from '../../repository/command/mysql/StatsMySQLCommand';
import { StatsValueMySQLCommand } from '../../repository/command/mysql/StatsValueMySQLCommand';
import { StatsUpdateFactory } from '../StatsUpdateFactory';

describe('StatsUpdateFactory', () => {
  describe('forgeStatsCommand', () => {
    it('returns StatsMySQLCommand instance', () => {
      expect.assertions(1);

      const sql: MockSQL = new MockSQL();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory();

      expect(statsUpdateFactory.forgeStatsCommand(sql)).toBeInstanceOf(StatsMySQLCommand);
    });
  });

  describe('forgeStatsItemCommand', () => {
    it('returns StatsItemMySQLCommand instance', () => {
      expect.assertions(1);

      const sql: MockSQL = new MockSQL();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory();

      expect(statsUpdateFactory.forgeStatsItemCommand(sql)).toBeInstanceOf(StatsItemMySQLCommand);
    });
  });

  describe('forgeStatsValueCommand', () => {
    it('returns StatsValueMySQLCommand instance', () => {
      expect.assertions(1);

      const sql: MockSQL = new MockSQL();

      const statsUpdateFactory: StatsUpdateFactory = new StatsUpdateFactory();

      expect(statsUpdateFactory.forgeStatsValueCommand(sql)).toBeInstanceOf(StatsValueMySQLCommand);
    });
  });
});
