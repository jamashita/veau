import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { StatsOutlinesError } from '../../veau-error/StatsOutlinesError';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { Try } from '../../veau-general/Try/Try';
import { Limit } from '../../veau-vo/Limit';
import { Offset } from '../../veau-vo/Offset';
import { StatsOutlineRow } from '../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { IMySQLQuery } from '../interfaces/IMySQLQuery';
import { IStatsOutlineQuery } from '../interfaces/IStatsOutlineQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery, IMySQLQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: MySQL;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL) {
    this.mysql = mysql;
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, limit: Limit, offset: Offset): Promise<Try<StatsOutlines, StatsOutlinesError>> {
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

    const statsOutlineRows: Array<StatsOutlineRow> = await this.mysql.execute<Array<StatsOutlineRow>>(query, {
      veauAccountID: veauAccountID.get(),
      limit: limit.get(),
      offset: offset.get()
    });

    return StatsOutlines.ofRow(statsOutlineRows);
  }
}
