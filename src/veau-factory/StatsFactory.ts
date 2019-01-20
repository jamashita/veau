import { Stats, StatsJSON, StatsRow } from '../veau-entity/Stats';
import { StatsID } from '../veau-vo/StatsID';
import {StatsItem, StatsItemJSON} from '../veau-vo/StatsItem';
import { Term } from '../veau-vo/Term';
import { UUID } from '../veau-vo/UUID';

export class StatsFactory {
  private static instance: StatsFactory = new StatsFactory();

  public static getInstance(): StatsFactory {
    return StatsFactory.instance;
  }

  private constructor() {
  }

  public from(statsID: StatsID, term: Term, name: string, unit: string, seq: number, items: Array<StatsItem>): Stats {
    return new Stats(statsID, term, name, unit, seq, items);
  }

  public fromJSON(json: StatsJSON): Stats {
    const {
      statsID,
      termID,
      name,
      unit,
      seq,
      items
    } = json;

    const statsItems: Array<StatsItem> = items.map<StatsItem>((item: StatsItemJSON) => {
      const {
        asOf,
        value
      } = item;

      return StatsItem.of(asOf, value);
    });

    return this.from(StatsID.of(UUID.of(statsID)), Term.of(termID), name, unit, seq, statsItems);
  }

  public fromRow(row: StatsRow, items: Array<StatsItem>): Stats {
    const {
      statsID,
      termID,
      name,
      unit,
      seq
    } = row;

    return this.from(StatsID.of(UUID.of(statsID)), Term.of(termID), name, unit, seq, items);
  }
}
