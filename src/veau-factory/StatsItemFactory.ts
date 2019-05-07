import * as moment from 'moment';
import { StatsValues } from '@/veau-collection/StatsValues';
import { StatsItem, StatsItemJSON, StatsItemRow } from '@/veau-entity/StatsItem';
import { StatsItemID } from '@/veau-vo/StatsItemID';
import { StatsValue, StatsValueJSON } from '@/veau-vo/StatsValue';
import { UUID } from '@/veau-vo/UUID';

export class StatsItemFactory {
  private static instance: StatsItemFactory = new StatsItemFactory();

  public static getInstance(): StatsItemFactory {
    return StatsItemFactory.instance;
  }

  private constructor() {
  }

  public from(statsItemID: StatsItemID, name: string, values: StatsValues): StatsItem {
    return new StatsItem(statsItemID, name, values);
  }

  public fromJSON(json: StatsItemJSON): StatsItem {
    const {
      statsItemID,
      name,
      values
    } = json;

    const statsValues: Array<StatsValue> = values.map<StatsValue>((statsValue: StatsValueJSON) => {
      const {
        asOf,
        value
      } = statsValue;

      return StatsValue.of(moment(asOf), value);
    });

    return this.from(StatsItemID.of(UUID.of(statsItemID)), name, new StatsValues(statsValues));
  }

  public fromRow(row: StatsItemRow, statsValues: StatsValues): StatsItem {
    const {
      statsItemID,
      name
    } = row;

    return this.from(StatsItemID.of(UUID.of(statsItemID)), name, statsValues);
  }
}
