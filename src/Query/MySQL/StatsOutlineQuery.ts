import { inject, injectable } from 'inversify';
import { DataSourceError, Dead, IMySQL, MySQLError, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsOutlineError } from '../../Error/StatsOutlineError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { Page } from '../../VO/Page';
import { StatsID } from '../../VO/StatsID';
import { StatsOutline, StatsOutlineRow } from '../../VO/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccountID';
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

  public async find(statsID: StatsID): Promise<Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.region_id AS regionID,
      R1.term_id AS termID,
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
      const statsOutlineRows: Array<StatsOutlineRow> = await this.mysql.execute<Array<StatsOutlineRow>>(
        query,
        {
          statsID: statsID.get().get()
        }
      );

      if (statsOutlineRows.length === 0) {
        return Dead.of<StatsOutline, NoSuchElementError>(new NoSuchElementError(statsID.toString()));
      }

      return StatsOutline.ofRow(statsOutlineRows[0]);
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Dead.of<StatsOutline, MySQLError>(err);
      }

      throw err;
    }
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.region_id AS regionID,
      R1.term_id AS termID,
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
      const statsOutlineRows: Array<StatsOutlineRow> = await this.mysql.execute<Array<StatsOutlineRow>>(
        query,
        {
          veauAccountID: veauAccountID.get().get(),
          limit: page.getLimit().get(),
          offset: page.getOffset().get()
        }
      );

      return StatsOutlines.ofRow(statsOutlineRows);
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Dead.of<StatsOutlines, MySQLError>(err);
      }

      throw err;
    }
  }
}
