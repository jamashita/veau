import * as moment from 'moment';
import { StatsValues } from '../veau-collection/StatsValues';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/StatsID';
import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsValue, StatsValueRow } from '../veau-vo/StatsValue';
import { IStatsValueRepository } from './interfaces/IStatsValueRepository';

export class StatsValueRepository implements IStatsValueRepository {
  private static instance: StatsValueRepository = new StatsValueRepository();

  public static getInstance(): StatsValueRepository {
    return StatsValueRepository.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<Map<string, StatsValues>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`;

    const statsValueRows: Array<StatsValueRow> = await VeauMySQL.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);

    const valueMap: Map<string, StatsValues> = new Map();

    statsValueRows.forEach((statsValueRow: StatsValueRow) => {
      const {
        statsItemID,
        asOf,
        value
      } = statsValueRow;

      const statsValue: StatsValue = StatsValue.of(moment(asOf), value);
      const statsValues: StatsValues | undefined = valueMap.get(statsItemID);

      if (statsValues) {
        valueMap.set(statsItemID, statsValues.set(statsValue));
        return;
      }

      valueMap.set(statsItemID, new StatsValues([
        statsValue
      ]));
    });

    return valueMap;
  }

  public create(statsItemID: StatsItemID, statsValue: StatsValue, transaction: Transaction): Promise<any> {
    const query: string = `INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`;

    return transaction.query(query, [
      {
        statsItemID: statsItemID.get().get(),
        asOf: statsValue.getAsOfAsString(),
        value: statsValue.getValue()
      }
    ]);
  }

  public deleteByStatsID(statsID: StatsID, transaction: Transaction): Promise<any> {
    const query: string = `DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`;

    return transaction.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);
  }
}
