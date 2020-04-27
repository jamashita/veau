import { Alive, DataSourceError, Dead, ISQL, MySQLError, Superposition } from 'publikum';
import { StatsID } from '../../VO/StatsID';
import { StatsValue } from '../../VO/StatsValue';
import { IMySQLCommand } from '../Interface/IMySQLCommand';
import { IStatsValueCommand } from '../Interface/IStatsValueCommand';

export class StatsValueCommand implements IStatsValueCommand, IMySQLCommand {
  public readonly noun: 'StatsValueCommand' = 'StatsValueCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly sql: ISQL;

  public constructor(sql: ISQL) {
    this.sql = sql;
  }

  public async create(statsValue: StatsValue): Promise<Superposition<void, DataSourceError>> {
    const query: string = `INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`;

    try {
      await this.sql.execute<unknown>(query, {
        statsItemID: statsValue.getStatsItemID().get().get(),
        asOf: statsValue.getAsOf().toString(),
        value: statsValue.getValue().get()
      });

      return Alive.of<DataSourceError>();
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Dead.of<MySQLError>(err);
      }

      throw err;
    }
  }

  public async deleteByStatsID(statsID: StatsID): Promise<Superposition<void, DataSourceError>> {
    const query: string = `DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`;

    try {
      await this.sql.execute<unknown>(query, {
        statsID: statsID.get().get()
      });

      return Alive.of<DataSourceError>();
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Dead.of<MySQLError>(err);
      }

      throw err;
    }
  }
}
