import { inject, injectable } from 'inversify';

import { DataSourceError } from '@jamashita/publikum-error';
import { Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { IMySQL, MySQLError } from '@jamashita/publikum-mysql';

import { Type } from '../../Container/Types';
import { Page } from '../../VO/Page/Page';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsOutline, StatsOutlineRow } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';
import { IMySQLQuery } from './Interface/IMySQLQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery, IMySQLQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async find(
    statsID: StatsID
  ): Promise<Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>> {
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

    const superposition: Superposition<Array<StatsOutlineRow>, MySQLError> = await Schrodinger.playground<
      Array<StatsOutlineRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<StatsOutlineRow>>(query, {
        statsID: statsID.get().get()
      });
    });

    return superposition.match<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>(
      (rows: Array<StatsOutlineRow>) => {
        if (rows.length === 0) {
          return Dead.of<StatsOutline, NoSuchElementError>(new NoSuchElementError(statsID.toString()));
        }

        return StatsOutline.ofRow(rows[0]);
      },
      (err: MySQLError) => {
        return Dead.of<StatsOutline, MySQLError>(err);
      }
    );
  }

  public async findByVeauAccountID(
    veauAccountID: VeauAccountID,
    page: Page
  ): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>> {
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

    const superposition: Superposition<Array<StatsOutlineRow>, MySQLError> = await Schrodinger.playground<
      Array<StatsOutlineRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<StatsOutlineRow>>(query, {
        veauAccountID: veauAccountID.get().get(),
        limit: page.getLimit().get(),
        offset: page.getOffset().get()
      });
    });

    return superposition.match<StatsOutlines, StatsOutlinesError | DataSourceError>(
      (rows: Array<StatsOutlineRow>) => {
        return StatsOutlines.ofRow(rows);
      },
      (err: MySQLError) => {
        return Dead.of<StatsOutlines, MySQLError>(err);
      }
    );
  }
}
