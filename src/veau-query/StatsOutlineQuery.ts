import { StatsOutlines } from '../veau-vo/collection/StatsOutlines';
import { StatsOutlineRow } from '../veau-vo/StatsOutline';
import { veauMySQL } from '../veau-infrastructure/VeauMySQL';
import { Limit } from '../veau-vo/Limit';
import { Offset } from '../veau-vo/Offset';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

export class StatsOutlineQuery {
  private static instance: StatsOutlineQuery = new StatsOutlineQuery();

  public static getInstance(): StatsOutlineQuery {
    return StatsOutlineQuery.instance;
  }

  private constructor() {
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, limit: Limit, offset: Offset): Promise<StatsOutlines> {
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

    const statsOutlineRows: Array<StatsOutlineRow> = await veauMySQL.execute<Array<StatsOutlineRow>>(query, {
      veauAccountID: veauAccountID.get(),
      limit: limit.get(),
      offset: offset.get()
    });

    return StatsOutlines.ofRow(statsOutlineRows);
  }
}
