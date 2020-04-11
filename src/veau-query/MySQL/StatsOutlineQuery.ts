import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { StatsOutlinesError } from '../../veau-error/StatsOutlinesError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { IMySQL } from '../../veau-general/MySQL/interfaces/IMySQL';
import { MySQLError } from '../../veau-general/MySQL/MySQLError';
import { Failure } from '../../veau-general/Try/Failure';
import { Try } from '../../veau-general/Try/Try';
import { Page } from '../../veau-vo/Page';
import { StatsOutlineRow } from '../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { IMySQLQuery } from '../Interface/IMySQLQuery';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery, IMySQLQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(TYPE.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Try<StatsOutlines, StatsOutlinesError | DataSourceError>> {
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

    try {
      const statsOutlineRows: Array<StatsOutlineRow> = await this.mysql.execute<Array<StatsOutlineRow>>(query, {
        veauAccountID: veauAccountID.get().get(),
        limit: page.getLimit().get(),
        offset: page.getOffset().get()
      });

      return StatsOutlines.ofRow(statsOutlineRows);
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<StatsOutlines, MySQLError>(err);
      }

      throw err;
    }
  }
}
