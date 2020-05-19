import { DataSourceError, ISQL, MySQLError, Schrodinger, Superposition } from 'publikum';

import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsValue } from '../../VO/StatsValue/StatsValue';
import { IMySQLCommand } from '../Interface/IMySQLCommand';
import { IStatsValueCommand } from '../Interface/IStatsValueCommand';

export class StatsValueCommand implements IStatsValueCommand, IMySQLCommand {
  public readonly noun: 'StatsValueCommand' = 'StatsValueCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly sql: ISQL;

  public constructor(sql: ISQL) {
    this.sql = sql;
  }

  public create(statsItemID: StatsItemID, statsValue: StatsValue): Promise<Superposition<unknown, DataSourceError>> {
    const query: string = `INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`;

    return (
      Promise.resolve <
      Superposition<unknown, MySQLError>(
        Schrodinger.playground<unknown, MySQLError>(() => {
          return this.sql.execute<unknown>(query, {
            statsItemID: statsItemID.get().get(),
            asOf: statsValue.getAsOf().toString(),
            value: statsValue.getValue().get()
          });
        })
      )
    );
  }

  public deleteByStatsID(statsID: StatsID): Promise<Superposition<unknown, DataSourceError>> {
    const query: string = `DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`;

    return (
      Promise.resolve <
      Superposition<unknown, MySQLError>(
        Schrodinger.playground<unknown, MySQLError>(() => {
          return this.sql.execute<unknown>(query, {
            statsID: statsID.get().get()
          });
        })
      )
    );
  }
}
