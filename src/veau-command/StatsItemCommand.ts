import { StatsItem } from '../veau-entity/StatsItem';
import { IQuery } from '../veau-general/MySQL/IQuery';
import { StatsID } from '../veau-vo/StatsID';

export class StatsItemCommand {
  private query: IQuery;

  public static getInstance(query: IQuery): StatsItemCommand {
    return new StatsItemCommand(query);
  }

  private constructor(query: IQuery) {
    this.query = query;
  }

  public create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<unknown> {
    const query: string = `INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`;

    return this.query.execute(query, {
      statsItemID: statsItem.getStatsItemID().get(),
      statsID: statsID.get(),
      name: statsItem.getName().get(),
      seq
    });
  }

  public deleteByStatsID(statsID: StatsID): Promise<unknown> {
    const query: string = `DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`;

    return this.query.execute(query, {
      statsID: statsID.get()
    });
  }
}
