import { ISQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Superposition } from '@jamashita/genitore';
import { Stats } from '../../../domain/entity/Stats/Stats';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { VeauAccountID } from '../../../domain/vo/VeauAccount/VeauAccountID';
import { IStatsCommand } from '../interface/IStatsCommand';
import { IMySQLCommand } from './IMySQLCommand';

export class StatsMySQLCommand implements IStatsCommand<MySQLError>, IMySQLCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly sql: ISQL;

  public constructor(sql: ISQL) {
    this.sql = sql;
  }

  public create(stats: Stats, veauAccountID: VeauAccountID): Superposition<unknown, MySQLError> {
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

    return Superposition.playground<unknown, MySQLError>(() => {
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
    }, MySQLError);
  }

  public deleteByStatsID(statsID: StatsID): Superposition<unknown, MySQLError> {
    const query: string = `DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`;

    return Superposition.playground<unknown, MySQLError>(() => {
      return this.sql.execute<unknown>(query, {
        statsID: statsID.get().get()
      });
    }, MySQLError);
  }
}
