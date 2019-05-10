import { Stats } from '../veau-entity/Stats';
import { Query } from '../veau-general/MySQL/Query';
import { StatsID } from '../veau-vo/StatsID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsCommand } from './interfaces/IStatsCommand';

export class StatsMySQLCommand implements IStatsCommand {
  private query: Query;

  public static getInstance(query: Query): StatsMySQLCommand {
    return new StatsMySQLCommand(query);
  }

  private constructor(query: Query) {
    this.query = query;
  }

  public async create(stats: Stats, veauAccountID: VeauAccountID): Promise<any> {
    const query: string = `INSERT INTO stats VALUES (
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      UTC_TIMESTAMP()
      );`;

    return this.query.execute(query, {
      statsID: stats.getStatsID().get().get(),
      languageID: stats.getLanguage().getLanguageID().get(),
      regionID: stats.getRegion().getRegionID().get(),
      termID: stats.getTerm().getID(),
      veauAccountID: veauAccountID.get().get(),
      name: stats.getName(),
      unit: stats.getUnit()
    });
  }

  public async deleteByStatsID(statsID: StatsID): Promise<any> {
    const query: string = `DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`;

    return this.query.execute(query, {
      statsID: statsID.get().get()
    });
  }
}
