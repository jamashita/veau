import { Stats, StatsRow } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/StatsID';
import { IStatsQuery } from './interfaces/IStatsQuery';
import { StatsItemMySQLQuery } from './StatsItemMySQLQuery';

const statsItemMySQLQuery: StatsItemMySQLQuery = StatsItemMySQLQuery.getInstance();
const statsFactory: StatsFactory = StatsFactory.getInstance();

export class StatsMySQLQuery implements IStatsQuery {

  public static getInstance(): StatsMySQLQuery {
    return new StatsMySQLQuery();
  }

  private constructor() {
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

    const rows: Array<StatsRow> = await VeauMySQL.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);

    if (rows.length === 0) {
      throw new NoSuchElementError(statsID.toString());
    }

    const items: Array<StatsItem> = await statsItemMySQLQuery.findByStatsID(statsID);

    return statsFactory.fromRow(rows[0], items);
  }
}
