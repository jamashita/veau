import { Alive, DataSourceError, Dead, ISQL, MySQLError, Superposition } from 'publikum';
import { Stats } from '../../Entity/Stats';
import { StatsID } from '../../VO/StatsID';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { IMySQLCommand } from '../Interface/IMySQLCommand';
import { IStatsCommand } from '../Interface/IStatsCommand';

export class StatsCommand implements IStatsCommand, IMySQLCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly sql: ISQL;

  public constructor(sql: ISQL) {
    this.sql = sql;
  }

  public async create(stats: Stats, veauAccountID: VeauAccountID): Promise<Superposition<void, DataSourceError>> {
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

    try {
      await this.sql.execute<unknown>(query, {
        statsID: stats.getStatsID().get().get(),
        languageID: stats.getLanguage().getLanguageID().get().get(),
        regionID: stats.getRegion().getRegionID().get().get(),
        termID: stats.getTerm().getID(),
        veauAccountID: veauAccountID.get().get(),
        name: stats.getName().get(),
        unit: stats.getUnit().get(),
        updatedAt: stats.getUpdatedAt().toString()
      });

      return Alive.of<DataSourceError>();
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Dead.of<MySQLError>(err);
      }

      throw err;
    }
  }

  public async deleteByStatsID(statsID: StatsID): Promise<Superposition<void, DataSourceError>> {
    const query: string = `DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`;

    try {
      await this.sql.execute<unknown>(query, {
        statsID: statsID.get().get()
      });

      return Alive.of<DataSourceError>();
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Dead.of<MySQLError>(err);
      }

      throw err;
    }
  }
}
