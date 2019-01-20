import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsValue, StatsValueJSON } from '../veau-vo/StatsValue';
import { Term } from '../veau-vo/Term';
import { Entity } from './Entity';

export type StatsItemJSON = {
  statsItemID: string;
  termID: number;
  name: string;
  unit: string;
  seq: number;
  values: Array<StatsValueJSON>;
};

export type StatsItemRow = {
  statsItemID: string;
  termID: number;
  name: string;
  unit: string;
  seq: number;
};

export class StatsItem extends Entity<StatsItemID> {
  private statsItemID: StatsItemID;
  private term: Term;
  private name: string;
  private unit: string;
  private seq: number;
  private values: Array<StatsValue>;

  public constructor(statsItemID: StatsItemID, term: Term, name: string, unit: string, seq: number, values: Array<StatsValue>) {
    super();
    this.statsItemID = statsItemID;
    this.term = term;
    this.name = name;
    this.unit = unit;
    this.seq = seq;
    this.values = values;
  }

  public getStatsItemID(): StatsItemID {
    return this.statsItemID;
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

  public getValues(): Array<StatsValue> {
    return this.values;
  }

  public getIdentifier(): StatsItemID {
    return this.statsItemID;
  }

  public toJSON(): StatsItemJSON {
    const {
      statsItemID,
      term,
      name,
      unit,
      seq,
      values
    } = this;

    return {
      statsItemID: statsItemID.get().get(),
      termID: term.get(),
      name,
      unit,
      seq,
      values: values.map<StatsValueJSON>((value: StatsValue) => {
        return value.toJSON();
      })
    };
  }

  public toString(): string {
    const {
      statsItemID,
      term,
      name,
      unit,
      seq
    } = this;

    return `${statsItemID.toString()} ${term.get()} ${name} ${unit} ${seq}`;
  }
}
