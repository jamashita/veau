import { StatsID } from '../veau-vo/StatsID';
import { StatsItem, StatsItemJSON } from '../veau-vo/StatsItem';
import { Term } from '../veau-vo/Term';
import { Entity } from './Entity';

export type StatsJSON = {
  statsID: string;
  termID: number;
  name: string;
  unit: string;
  seq: number;
  items: Array<StatsItemJSON>;
};

export type StatsRow = {
  statsID: string;
  termID: number;
  name: string;
  unit: string;
  seq: number;
};

export class Stats extends Entity<StatsID> {
  private statsID: StatsID;
  private term: Term;
  private name: string;
  private unit: string;
  private seq: number;
  private items: Array<StatsItem>;

  public constructor(statsID: StatsID, term: Term, name: string, unit: string, seq: number, items: Array<StatsItem>) {
    super();
    this.statsID = statsID;
    this.term = term;
    this.name = name;
    this.unit = unit;
    this.seq = seq;
    this.items = items;
  }

  public getStatsID(): StatsID {
    return this.statsID;
  }

  public getTerm(): Term {
    return this.term;
  }

  public getName(): string {
    return this.name;
  }

  public getUnit(): string {
    return this.unit;
  }

  public getSeq(): number {
    return this.seq;
  }

  public getItems(): Array<StatsItem> {
    return this.items;
  }

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public toJSON(): StatsJSON {
    const {
      statsID,
      term,
      name,
      unit,
      seq,
      items
    } = this;

    return {
      statsID: statsID.get().get(),
      termID: term.get(),
      name,
      unit,
      seq,
      items: items.map<StatsItemJSON>((item) => {
        return item.toJSON();
      })
    };
  }

  public toString(): string {
    const {
      statsID,
      term,
      name,
      unit,
      seq
    } = this;

    return `${statsID.toString()} ${term.get()} ${name} ${unit} ${seq}`;
  }
}
