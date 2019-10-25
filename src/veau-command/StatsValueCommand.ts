import { IQuery } from '../veau-general/MySQL/IQuery';
import { StatsID } from '../veau-vo/StatsID';
import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsValue } from '../veau-vo/StatsValue';

export class StatsValueCommand {
  private query: IQuery;

  public static of(query: IQuery): StatsValueCommand {
    return new StatsValueCommand(query);
  }

  private constructor(query: IQuery) {
    this.query = query;
  }

  public create(statsItemID: StatsItemID, statsValue: StatsValue): Promise<unknown> {
    const query: string = `INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`;

    return this.query.execute(query, {
      statsItemID: statsItemID.get(),
      asOf: statsValue.getAsOfAsString(),
      value: statsValue.getValue()
    });
  }

  public deleteByStatsID(statsID: StatsID): Promise<unknown> {
    const query: string = `DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`;

    return this.query.execute(query, {
      statsID: statsID.get()
    });
  }
}
