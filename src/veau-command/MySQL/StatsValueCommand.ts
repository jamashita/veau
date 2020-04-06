import { IQuery } from '../../veau-general/MySQL/interfaces/IQuery';
import { MySQLError } from '../../veau-general/MySQL/MySQLError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { IMySQLCommand } from '../interfaces/IMySQLCommand';
import { IStatsValueCommand } from '../interfaces/IStatsValueCommand';

export class StatsValueCommand implements IStatsValueCommand<MySQLError>, IMySQLCommand {
  public readonly noun: 'StatsValueCommand' = 'StatsValueCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly query: IQuery;

  public static of(query: IQuery): StatsValueCommand {
    return new StatsValueCommand(query);
  }

  private constructor(query: IQuery) {
    this.query = query;
  }

  public async create(statsValue: StatsValue): Promise<Try<void, MySQLError>> {
    const query: string = `INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`;


    try {
      await this.query.execute<unknown>(query, {
        statsItemID: statsValue.getStatsItemID().get(),
        asOf: statsValue.getAsOf().toString(),
        value: statsValue.getValue().get()
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
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`;

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
