import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { Stats, StatsRow } from '../veau-entity/Stats';
import { StatsItems } from '../veau-entity/StatsItems';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { StatsID } from '../veau-vo/StatsID';
import { StatsItemQuery } from './StatsItemQuery';

@injectable()
export class StatsQuery {
  private mysql: MySQL;
  private statsItemQuery: StatsItemQuery;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL,
    @inject(TYPE.StatsItemQuery) statsItemQuery: StatsItemQuery
  ) {
    this.mysql = mysql;
    this.statsItemQuery = statsItemQuery;
  }

  public async findByStatsID(statsID: StatsID): Promise<Stats> {
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
      throw new NoSuchElementError(statsID.toString());
    }

    const items: StatsItems = await this.statsItemQuery.findByStatsID(statsID);

    return Stats.fromRow(statsRows[0], items);
  }
}
