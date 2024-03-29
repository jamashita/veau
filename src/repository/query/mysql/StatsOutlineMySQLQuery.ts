import { IMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { Page } from '../../../domain/vo/Page/Page.js';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError.js';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID.js';
import { StatsOutline, StatsOutlineRow } from '../../../domain/vo/StatsOutline/StatsOutline.js';
import { StatsOutlines } from '../../../domain/vo/StatsOutline/StatsOutlines.js';
import { VeauAccountID } from '../../../domain/vo/VeauAccount/VeauAccountID.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IStatsOutlineQuery } from '../IStatsOutlineQuery.js';
import { IMySQLQuery } from './IMySQLQuery.js';

@injectable()
export class StatsOutlineMySQLQuery implements IStatsOutlineQuery<MySQLError>, IMySQLQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public find(statsID: StatsID): Superposition<StatsOutline, MySQLError | NoSuchElementError | StatsOutlineError> {
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.region_id AS regionID,
      R1.term_id AS termID,
      R1.name,
      R1.unit,
      R1.updated_at AS updatedAt
      FROM stats R1
      WHERE R1.stats_id = :statsID;`;

    return Superposition.playground<Array<StatsOutlineRow>, MySQLError>(() => {
      return this.mysql.execute<Array<StatsOutlineRow>>(query, {
        statsID: statsID.get().get()
      });
    }, MySQLError).map<StatsOutline, MySQLError | NoSuchElementError | StatsOutlineError>((rows: Array<StatsOutlineRow>) => {
      if (rows.length === 0) {
        throw new NoSuchElementError(statsID.toString());
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return StatsOutline.ofRow(rows[0]!);
    }, StatsOutlineError, NoSuchElementError);
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, MySQLError | StatsOutlineError> {
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.region_id AS regionID,
      R1.term_id AS termID,
      R1.name,
      R1.unit,
      R1.updated_at AS updatedAt
      FROM stats R1
      WHERE R1.veau_account_id = :veauAccountID
      LIMIT :limit
      OFFSET :offset;`;

    return Superposition.playground<Array<StatsOutlineRow>, MySQLError>(() => {
      return this.mysql.execute<Array<StatsOutlineRow>>(query, {
        veauAccountID: veauAccountID.get().get(),
        limit: page.getLimit().get(),
        offset: page.getOffset().get()
      });
    }, MySQLError).map<StatsOutlines, MySQLError | StatsOutlineError>((rows: Array<StatsOutlineRow>) => {
      return StatsOutlines.ofRow(rows);
    }, StatsOutlineError);
  }
}
