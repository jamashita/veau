import { IMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { Page } from '../../domain/VO/Page/Page';
import { StatsOutlineError } from '../../domain/VO/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../../domain/VO/StatsOutline/StatsID';
import { StatsOutline, StatsOutlineRow } from '../../domain/VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../domain/VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../domain/VO/VeauAccount/VeauAccountID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';
import { IMySQLQuery } from './Interface/IMySQLQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery<MySQLError>, IMySQLQuery {
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
