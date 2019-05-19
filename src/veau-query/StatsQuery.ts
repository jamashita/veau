import { Stats, StatsRow } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { StatsOutline, StatsOutlineRow } from '../veau-entity/StatsOutline';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { StatsOutlineFactory } from '../veau-factory/StatsOutlineFactory';
import { veauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/StatsID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { StatsItemQuery } from './StatsItemQuery';

const statsItemQuery: StatsItemQuery = StatsItemQuery.getInstance();
const statsFactory: StatsFactory = StatsFactory.getInstance();
const statsOutlineFactory: StatsOutlineFactory = StatsOutlineFactory.getInstance();

export class StatsQuery {
  private static instance: StatsQuery = new StatsQuery();

  public static getInstance(): StatsQuery {
    return StatsQuery.instance;
  }

  private constructor() {
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, limit: number, offset: number): Promise<Array<StatsOutline>> {
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

    const statsOutlineRows: Array<StatsOutlineRow> = await veauMySQL.execute(query, {
        veauAccountID: veauAccountID.get().get(),
        limit,
        offset
      }
    );

    return statsOutlineRows.map<StatsOutline>((statsOutlineRow: StatsOutlineRow) => {
      return statsOutlineFactory.fromRow(statsOutlineRow);
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

    const statsRows: Array<StatsRow> = await veauMySQL.execute(query, {
      statsID: statsID.get().get()
    });

    if (statsRows.length === 0) {
      throw new NoSuchElementError(statsID.toString());
    }

    const items: Array<StatsItem> = await statsItemQuery.findByStatsID(statsID);

    return statsFactory.fromRow(statsRows[0], items);
  }
}
