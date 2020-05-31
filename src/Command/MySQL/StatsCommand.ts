import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { ISQL, MySQLError } from '@jamashita/publikum-mysql';

import { Stats } from '../../Entity/Stats/Stats';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { IStatsCommand } from '../Interface/IStatsCommand';
import { IMySQLCommand } from './Interface/IMySQLCommand';

export class StatsCommand implements IStatsCommand, IMySQLCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly sql: ISQL;

  public constructor(sql: ISQL) {
    this.sql = sql;
  }

  public create(stats: Stats, veauAccountID: VeauAccountID): Promise<Superposition<unknown, DataSourceError>> {
    const query: string = `INSERT INTO stats VALUES (
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      :updatedAt
      );`;

    return Promise.resolve<Superposition<unknown, MySQLError>>(
      Schrodinger.playground<unknown, MySQLError>(() => {
        return this.sql.execute<unknown>(query, {
          statsID: stats.getStatsID().get().get(),
          languageID: stats.getLanguage().getLanguageID().get().get(),
          regionID: stats.getRegion().getRegionID().get().get(),
          termID: stats.getTerm().getTermID().get().get(),
          veauAccountID: veauAccountID.get().get(),
          name: stats.getName().get(),
          unit: stats.getUnit().get(),
          updatedAt: stats.getUpdatedAt().toString()
        });
      })
    );
  }

  public deleteByStatsID(statsID: StatsID): Promise<Superposition<unknown, DataSourceError>> {
    const query: string = `DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`;

    return Promise.resolve<Superposition<unknown, MySQLError>>(
      Schrodinger.playground<unknown, MySQLError>(() => {
        return this.sql.execute<unknown>(query, {
          statsID: statsID.get().get()
        });
      })
    );
  }
}
