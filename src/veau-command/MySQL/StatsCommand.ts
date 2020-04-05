import { Stats } from '../../veau-entity/Stats';
import { IQuery } from '../../veau-general/MySQL/IQuery';
import { StatsID } from '../../veau-vo/StatsID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { IStatsCommand } from '../interfaces/IStatsCommand';

export class StatsCommand implements IStatsCommand {
  private query: IQuery;

  public static of(query: IQuery): StatsCommand {
    return new StatsCommand(query);
  }

  private constructor(query: IQuery) {
    this.query = query;
  }

  public create(stats: Stats, veauAccountID: VeauAccountID): Promise<unknown> {
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
      statsID: stats.getStatsID().get(),
      languageID: stats.getLanguage().getLanguageID().get(),
      regionID: stats.getRegion().getRegionID().get(),
      termID: stats.getTerm().getID(),
      veauAccountID: veauAccountID.get(),
      name: stats.getName().get(),
      unit: stats.getUnit().get()
    });
  }

  public deleteByStatsID(statsID: StatsID): Promise<unknown> {
    const query: string = `DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`;

    return this.query.execute(query, {
      statsID: statsID.get()
    });
  }
}
