import * as moment from 'moment';
import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsValue, StatsValueJSON } from '../veau-vo/StatsValue';
import { StatsValues } from '../veau-vo/StatsValues';
import { UUID } from '../veau-vo/UUID';
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
  private values: StatsValues;

  public static default(): StatsItem {
    return new StatsItem(StatsItemID.of(UUID.generate()), '', '', 0, StatsValues.of([]));
  }

  public constructor(statsItemID: StatsItemID, name: string, unit: string, seq: number, values: StatsValues) {
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

  public getValues(): StatsValues {
    return this.values;
  }

  public getIdentifier(): StatsItemID {
    return this.statsItemID;
  }

  public getAsOfs(): Array<moment.Moment> {
    return this.values.get().map<moment.Moment>((statsValue: StatsValue) => {
      return statsValue.getAsOf();
    });
  }

  public getValuesByColumn(column: Array<string>): Array<string> {
    const valuesByColumn: Array<string> = [];

    column.forEach((term: string) => {
      let alreadyInput: boolean = false;

      this.values.get().forEach((statsValue: StatsValue) => {
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

  public setValue(asOf: moment.Moment, value: number): void {
    const statsValue: StatsValue = StatsValue.of(asOf, value);
    this.values.setStatsValue(statsValue);
  }

  public delete(asOf: moment.Moment): void {
    this.values.deleteStatsValue(asOf);
  }

  public isFilled(): boolean {
    const {
      name,
      unit
    } = this;

    if (name === '') {
      return false;
    }
    if (unit === '') {
      return false;
    }

    return true;
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
      values: values.toJSON()
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
