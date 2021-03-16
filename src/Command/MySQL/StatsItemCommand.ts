import { Superposition } from '@jamashita/publikum-monad';
import { ISQL, MySQLError } from '@jamashita/publikum-mysql';
import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { IStatsItemCommand } from '../Interface/IStatsItemCommand';
import { IMySQLCommand } from './Interface/IMySQLCommand';

export class StatsItemCommand implements IStatsItemCommand<MySQLError>, IMySQLCommand {
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
