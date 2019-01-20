import { StatsItem, StatsItemJSON, StatsItemRow } from '../veau-entity/StatsItem';
import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsValue, StatsValueJSON } from '../veau-vo/StatsValue';
import { Term } from '../veau-vo/Term';
import { UUID } from '../veau-vo/UUID';

export class StatsItemFactory {
  private static instance: StatsItemFactory = new StatsItemFactory();

  public static getInstance(): StatsItemFactory {
    return StatsItemFactory.instance;
  }

  private constructor() {
  }

  public from(statsItemID: StatsItemID, term: Term, name: string, unit: string, seq: number, items: Array<StatsValue>): StatsItem {
    return new StatsItem(statsItemID, term, name, unit, seq, items);
  }

  public fromJSON(json: StatsItemJSON): StatsItem {
    const {
      statsItemID,
      termID,
      name,
      unit,
      seq,
      values
    } = json;

    const statsValues: Array<StatsValue> = values.map<StatsValue>((statsValue: StatsValueJSON) => {
      const {
        asOf,
        value
      } = statsValue;

      return StatsValue.of(asOf, value);
    });

    return this.from(StatsItemID.of(UUID.of(statsItemID)), Term.of(termID), name, unit, seq, statsValues);
  }

  public fromRow(row: StatsItemRow, statsValues: Array<StatsValue>): StatsItem {
    const {
      statsItemID,
      termID,
      name,
      unit,
      seq
    } = row;

    return this.from(StatsItemID.of(UUID.of(statsItemID)), Term.of(termID), name, unit, seq, statsValues);
  }
}
