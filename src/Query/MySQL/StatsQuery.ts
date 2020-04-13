import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { Stats, StatsRow } from '../../Entity/Stats';
import { StatsItems } from '../../Entity/StatsItems';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { StatsItemsError } from '../../Error/StatsItemsError';
import { DataSourceError } from '../../General/DataSourceError';
import { IMySQL } from '../../General/MySQL/Interface/IMySQL';
import { MySQLError } from '../../General/MySQL/MySQLError';
import { Failure } from '../../General/Try/Failure';
import { Try } from '../../General/Try/Try';
import { StatsID } from '../../VO/StatsID';
import { IMySQLQuery } from '../Interface/IMySQLQuery';
import { IStatsItemQuery } from '../Interface/IStatsItemQuery';
import { IStatsQuery } from '../Interface/IStatsQuery';

@injectable()
export class StatsQuery implements IStatsQuery, IMySQLQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;
  private readonly statsItemQuery: IStatsItemQuery;

  public constructor(
    @inject(TYPE.MySQL) mysql: IMySQL,
    @inject(TYPE.StatsItemMySQLQuery) statsItemQuery: IStatsItemQuery
  ) {
    this.mysql = mysql;
    this.statsItemQuery = statsItemQuery;
  }

  public async findByStatsID(statsID: StatsID): Promise<Try<Stats, StatsError | NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.term_id AS termID,
      R2.name AS languageName,
      R2.english_name AS languageEnglishName,
      R2.iso639,
      R1.region_id AS regionID,
      R3.name AS regionName,
      R3.iso3166,
      R1.name,
      R1.unit,
      R1.updated_at AS updatedAt
      FROM stats R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN regions R3
      USING(region_id)
      WHERE R1.stats_id = :statsID;`;

    try {
      const statsRows: Array<StatsRow> = await this.mysql.execute<Array<StatsRow>>(
        query,
        {
          statsID: statsID.get().get()
        }
      );

      if (statsRows.length === 0) {
        return Failure.of<Stats, NoSuchElementError>(new NoSuchElementError(statsID.get().get()));
      }

      const trial: Try<StatsItems, StatsItemsError | DataSourceError> = await this.statsItemQuery.findByStatsID(statsID);

      return trial.match<Try<Stats, StatsError | DataSourceError>>((statsItems: StatsItems) => {
        return Stats.ofRow(statsRows[0], statsItems);
      }, (err: StatsItemsError | DataSourceError) => {
        if (err instanceof DataSourceError) {
          return Failure.of<Stats, DataSourceError>(err);
        }

        return Failure.of<Stats, StatsError>(new StatsError('StatsQuery.findByStatsID()', err));
      });
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<Stats, MySQLError>(err);
      }

      throw err;
    }
  }
}
