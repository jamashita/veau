import * as moment from 'moment';
import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsValue, StatsValueJSON } from '../veau-vo/StatsValue';
import { Entity } from './Entity';

export type StatsItemJSON = {
  statsItemID: string;
  name: string;
  unit: string;
  seq: number;
  values: Array<StatsValueJSON>;
};

export type StatsItemRow = {
  statsItemID: string;
  name: string;
  unit: string;
  seq: number;
};

export class StatsItem extends Entity<StatsItemID> {
  private statsItemID: StatsItemID;
  private name: string;
  private unit: string;
  private seq: number;
  private values: Array<StatsValue>;

  public constructor(statsItemID: StatsItemID, name: string, unit: string, seq: number, values: Array<StatsValue>) {
    super();
    this.statsItemID = statsItemID;
    this.name = name;
    this.unit = unit;
    this.seq = seq;
    this.values = values;
  }

  public getStatsItemID(): StatsItemID {
    return this.statsItemID;
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

  public getAsOfs(): Array<moment.Moment> {
    return this.values.map<moment.Moment>((statsValue: StatsValue) => {
      return statsValue.getAsOf();
    });
  }

  public getValuesByColumn(column: Array<string>): Array<string> {
    const valuesByColumn: Array<string> = [];

    column.forEach((term: string) => {
      let alreadyInput: boolean = false;

      this.values.forEach((statsValue: StatsValue) => {
        if (alreadyInput) {
          return;
        }
        if (term === statsValue.getAsOfAsString()) {
          valuesByColumn.push(statsValue.getValue().toString());
          alreadyInput = true;
          return;
        }
      });
      if (!alreadyInput) {
        valuesByColumn.push('');
      }
    });

    return valuesByColumn;
  }

  public toJSON(): StatsItemJSON {
    const {
      statsItemID,
      name,
      unit,
      seq,
      values
    } = this;

    return {
      statsItemID: statsItemID.get().get(),
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
      name,
      unit,
      seq
    } = this;

    return `${statsItemID.toString()} ${name} ${unit} ${seq}`;
  }
}
