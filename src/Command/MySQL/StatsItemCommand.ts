import { StatsItem } from '../../veau-entity/StatsItem';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { IQuery } from '../../veau-general/MySQL/Interface/IQuery';
import { MySQLError } from '../../veau-general/MySQL/MySQLError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { IMySQLCommand } from '../Interface/IMySQLCommand';
import { IStatsItemCommand } from '../Interface/IStatsItemCommand';

export class StatsItemCommand implements IStatsItemCommand, IMySQLCommand {
  public readonly noun: 'StatsItemCommand' = 'StatsItemCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly query: IQuery;

  public static of(query: IQuery): StatsItemCommand {
    return new StatsItemCommand(query);
  }

  private constructor(query: IQuery) {
    this.query = query;
  }

  public async create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Try<void, DataSourceError>> {
    const query: string = `INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`;

    try {
      await this.query.execute<unknown>(query, {
        statsItemID: statsItem.getStatsItemID().get().get(),
        statsID: statsID.get().get(),
        name: statsItem.getName().get(),
        seq
      });

      return Success.of<DataSourceError>();
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<MySQLError>(err);
      }

      throw err;
    }
  }

  public async deleteByStatsID(statsID: StatsID): Promise<Try<void, DataSourceError>> {
    const query: string = `DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`;

    try {
      await this.query.execute<unknown>(query, {
        statsID: statsID.get().get()
      });

      return Success.of<DataSourceError>();
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<MySQLError>(err);
      }

      throw err;
    }
  }
}
