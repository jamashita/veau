import { Alive, DataSourceError, Dead, ISQL, MySQLError, Superposition } from 'publikum';
import { StatsItem } from '../../Entity/StatsItem';
import { StatsID } from '../../VO/StatsID';
import { IMySQLCommand } from '../Interface/IMySQLCommand';
import { IStatsItemCommand } from '../Interface/IStatsItemCommand';

export class StatsItemCommand implements IStatsItemCommand, IMySQLCommand {
  public readonly noun: 'StatsItemCommand' = 'StatsItemCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly sql: ISQL;

  public constructor(sql: ISQL) {
    this.sql = sql;
  }

  public async create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Superposition<void, DataSourceError>> {
    const query: string = `INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`;

    try {
      await this.sql.execute<unknown>(query, {
        statsItemID: statsItem.getStatsItemID().get().get(),
        statsID: statsID.get().get(),
        name: statsItem.getName().get(),
        seq
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
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`;

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
