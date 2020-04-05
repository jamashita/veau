import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { Stats, StatsRow } from '../../veau-entity/Stats';
import { StatsItems } from '../../veau-entity/StatsItems';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { StatsError } from '../../veau-error/StatsError';
import { StatsItemsError } from '../../veau-error/StatsItemsError';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { Failure } from '../../veau-general/Try/Failure';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { IStatsItemQuery } from '../interfaces/IStatsItemQuery';
import { IStatsQuery } from '../interfaces/IStatsQuery';

@injectable()
export class StatsQuery implements IStatsQuery {
  private readonly mysql: MySQL;
  private readonly statsItemQuery: IStatsItemQuery;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL,
    @inject(TYPE.StatsItemQuery) statsItemQuery: IStatsItemQuery
  ) {
    this.mysql = mysql;
    this.statsItemQuery = statsItemQuery;
  }

  public async findByStatsID(statsID: StatsID): Promise<Try<Stats, NoSuchElementError | StatsError>> {
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

    const statsRows: Array<StatsRow> = await this.mysql.execute<Array<StatsRow>>(query, {
      statsID: statsID.get()
    });

    if (statsRows.length === 0) {
      return Failure.of<Stats, NoSuchElementError>(new NoSuchElementError(statsID.toString()));
    }

    const trial: Try<StatsItems, StatsItemsError> = await this.statsItemQuery.findByStatsID(statsID);

    return trial.match<Try<Stats, StatsError>>((statsItems: StatsItems) => {
      return Stats.ofRow(statsRows[0], statsItems);
    }, (err: StatsItemsError) => {
      return Failure.of<Stats, StatsError>(new StatsError(err.message));
    });
  }
}
