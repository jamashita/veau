import { IQuery } from '../veau-general/MySQL/IQuery';
import { StatsID } from '../veau-vo/StatsID';
import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsValue } from '../veau-vo/StatsValue';
import { IStatsValueCommand } from './interfaces/IStatsValueCommand';

export class StatsValueMySQLCommand implements IStatsValueCommand {
  private query: IQuery;

  public static getInstance(query: IQuery): StatsValueMySQLCommand {
    return new StatsValueMySQLCommand(query);
  }

  private constructor(query: IQuery) {
    this.query = query;
  }

  public create(statsItemID: StatsItemID, statsValue: StatsValue): Promise<any> {
    const query: string = `INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`;

    return this.query.execute(query, {
      statsItemID: statsItemID.get().get(),
      asOf: statsValue.getAsOfAsString(),
      value: statsValue.getValue()
    });
  }

  public deleteByStatsID(statsID: StatsID): Promise<any> {
    const query: string = `DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`;

    return this.query.execute(query, {
      statsID: statsID.get().get()
    });
  }
}
