import { Stats } from '../../Entity/Stats';
import { DataSourceError } from '../../General/DataSourceError';
import { IQuery } from '../../General/MySQL/Interface/IQuery';
import { MySQLError } from '../../General/MySQL/MySQLError';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
import { StatsID } from '../../VO/StatsID';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { IMySQLCommand } from '../Interface/IMySQLCommand';
import { IStatsCommand } from '../Interface/IStatsCommand';

export class StatsCommand implements IStatsCommand, IMySQLCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly query: IQuery;

  public static of(query: IQuery): StatsCommand {
    return new StatsCommand(query);
  }

  private constructor(query: IQuery) {
    this.query = query;
  }

  public async create(stats: Stats, veauAccountID: VeauAccountID): Promise<Try<void, DataSourceError>> {
    const query: string = `INSERT INTO stats VALUES (
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      UTC_TIMESTAMP()
      );`;

    try {
      await this.query.execute<unknown>(query, {
        statsID: stats.getStatsID().get().get(),
        languageID: stats.getLanguage().getLanguageID().get(),
        regionID: stats.getRegion().getRegionID().get(),
        termID: stats.getTerm().getID(),
        veauAccountID: veauAccountID.get().get(),
        name: stats.getName().get(),
        unit: stats.getUnit().get()
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
      FROM stats R1
      WHERE R1.stats_id = :statsID;`;

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
