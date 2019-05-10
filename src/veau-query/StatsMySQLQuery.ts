import { Stats, StatsRow } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/StatsID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsQuery } from './interfaces/IStatsQuery';
import { StatsItemMySQLQuery } from './StatsItemMySQLQuery';

const statsItemMySQLQuery: StatsItemMySQLQuery = StatsItemMySQLQuery.getInstance();
const statsFactory: StatsFactory = StatsFactory.getInstance();

const LIMIT: number = 40;

export class StatsMySQLQuery implements IStatsQuery {
  private static instance: StatsMySQLQuery = new StatsMySQLQuery();

  public static getInstance(): StatsMySQLQuery {
    return StatsMySQLQuery.instance;
  }

  private constructor() {
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<Stats>> {
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
      WHERE R1.veau_account_id = :veauAccountID
      LIMIT :limit
      OFFSET :offset;`;

    const statsRows: Array<StatsRow> = await VeauMySQL.execute(query, {
        veauAccountID: veauAccountID.get().get(),
        limit: LIMIT,
        offset: (page - 1) * LIMIT
      }
    );

    return statsRows.map<Stats>((statsRow: StatsRow) => {
      return statsFactory.fromRow(statsRow, []);
    });
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

    const statsRows: Array<StatsRow> = await VeauMySQL.execute(query, {
      statsID: statsID.get().get()
    });

    if (statsRows.length === 0) {
      throw new NoSuchElementError(statsID.toString());
    }

    const items: Array<StatsItem> = await statsItemMySQLQuery.findByStatsID(statsID);

    return statsFactory.fromRow(statsRows[0], items);
  }
}
