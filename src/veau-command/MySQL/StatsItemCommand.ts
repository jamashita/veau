import { StatsItem } from '../../veau-entity/StatsItem';
import { IQuery } from '../../veau-general/MySQL/IQuery';
import { MySQLError } from '../../veau-general/MySQL/MySQLError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { IMySQLCommand } from '../interfaces/IMySQLCommand';
import { IStatsItemCommand } from '../interfaces/IStatsItemCommand';

export class StatsItemCommand implements IStatsItemCommand<MySQLError>, IMySQLCommand {
  public readonly noun: 'StatsItemCommand' = 'StatsItemCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly query: IQuery;

  public static of(query: IQuery): StatsItemCommand {
    return new StatsItemCommand(query);
  }

  private constructor(query: IQuery) {
    this.query = query;
  }

  public async create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Try<void, MySQLError>> {
    const query: string = `INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`;

    try {
      await this.query.execute<unknown>(query, {
        statsItemID: statsItem.getStatsItemID().get(),
        statsID: statsID.get(),
        name: statsItem.getName().get(),
        seq
      });

      return Success.of<void, MySQLError>(undefined);
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<void, MySQLError>(err);
      }

      throw err;
    }
  }

  public async deleteByStatsID(statsID: StatsID): Promise<Try<void, MySQLError>> {
    const query: string = `DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`;

    try {
      await this.query.execute<unknown>(query, {
        statsID: statsID.get()
      });

      return Success.of<void, MySQLError>(undefined);
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<void, MySQLError>(err);
      }

      throw err;
    }
  }
}
