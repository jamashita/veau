import { DataSourceError, ISQL, MySQLError, Schrodinger, Superposition } from 'publikum';

import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { IMySQLCommand } from '../Interface/IMySQLCommand';
import { IStatsItemCommand } from '../Interface/IStatsItemCommand';

export class StatsItemCommand implements IStatsItemCommand, IMySQLCommand {
  public readonly noun: 'StatsItemCommand' = 'StatsItemCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly sql: ISQL;

  public constructor(sql: ISQL) {
    this.sql = sql;
  }

  public create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Superposition<unknown, DataSourceError>> {
    const query: string = `INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`;

    return Promise.resolve<Superposition<unknown, MySQLError>>(
      Schrodinger.playground<unknown, MySQLError>(() => {
        return this.sql.execute<unknown>(query, {
          statsItemID: statsItem.getStatsItemID().get().get(),
          statsID: statsID.get().get(),
          name: statsItem.getName().get(),
          seq
        });
      })
    );
  }

  public deleteByStatsID(statsID: StatsID): Promise<Superposition<unknown, DataSourceError>> {
    const query: string = `DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`;

    return Promise.resolve<Superposition<unknown, MySQLError>>(
      Schrodinger.playground<unknown, MySQLError>(() => {
        return this.sql.execute<unknown>(query, {
          statsID: statsID.get().get()
        });
      })
    );
  }
}
