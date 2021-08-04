import { ISQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatsItem } from '../../../domain/entity/StatsItem/StatsItem.js';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID.js';
import { IStatsItemCommand } from '../IStatsItemCommand.js';
import { IMySQLCommand } from './IMySQLCommand.js';

export class StatsItemMySQLCommand implements IStatsItemCommand<MySQLError>, IMySQLCommand {
  public readonly noun: 'StatsItemCommand' = 'StatsItemCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly sql: ISQL;

  public constructor(sql: ISQL) {
    this.sql = sql;
  }

  public create(statsID: StatsID, statsItem: StatsItem, seq: number): Superposition<unknown, MySQLError> {
    const query: string = `INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`;

    return Superposition.playground<unknown, MySQLError>(() => {
      return this.sql.execute<unknown>(query, {
        statsItemID: statsItem.getStatsItemID().get().get(),
        statsID: statsID.get().get(),
        name: statsItem.getName().get(),
        seq
      });
    }, MySQLError);
  }

  public deleteByStatsID(statsID: StatsID): Superposition<unknown, MySQLError> {
    const query: string = `DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`;

    return Superposition.playground<unknown, MySQLError>(() => {
      return this.sql.execute<unknown>(query, {
        statsID: statsID.get().get()
      });
    }, MySQLError);
  }
}
