import * as moment from 'moment';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue, StatsValueRow } from '../veau-vo/StatsValue';
import { StatsValues } from '../veau-vo/StatsValues';

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
        statsValues.set(statsValue);
        return;
      }

      valueMap.set(statsItemID, StatsValues.of([
        statsValue
      ]));
    });

    return valueMap;
  }
}

export interface IStatsValueRepository {

  findByStatsID(statsID: StatsID): Promise<Map<string, StatsValues>>;
}
