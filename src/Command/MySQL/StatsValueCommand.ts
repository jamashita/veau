import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { ISQL, MySQLError } from '@jamashita/publikum-mysql';

import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsValue } from '../../VO/StatsValue/StatsValue';
import { IStatsValueCommand } from '../Interface/IStatsValueCommand';
import { IMySQLCommand } from './Interface/IMySQLCommand';

export class StatsValueCommand implements IStatsValueCommand, IMySQLCommand {
  public readonly noun: 'StatsValueCommand' = 'StatsValueCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly sql: ISQL;

  public constructor(sql: ISQL) {
    this.sql = sql;
  }

  public create(statsItemID: StatsItemID, statsValue: StatsValue): Superposition<unknown, MySQLError> {
    const query: string = `INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`;

    return Superposition.playground<unknown, MySQLError>(() => {
      return this.sql.execute<unknown>(query, {
        statsItemID: statsItemID.get().get(),
        asOf: statsValue.getAsOf().toString(),
        value: statsValue.getValue().get()
      });
    });
  }

  public deleteByStatsID(statsID: StatsID): Superposition<unknown, MySQLError> {
    const query: string = `DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`;

    return Superposition.playground<unknown, MySQLError>(() => {
      return this.sql.execute<unknown>(query, {
        statsID: statsID.get().get()
      });
    });
  }
}
