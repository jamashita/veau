import * as moment from 'moment';
import { UUID } from '../veau-general/UUID';
import { StatsValues } from '../veau-vo/collection/StatsValues';
import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsItemName } from '../veau-vo/StatsItemName';
import { StatsValue, StatsValueJSON } from '../veau-vo/StatsValue';
import { Entity } from './Entity';

export type StatsItemJSON = {
  statsItemID: string;
  name: string;
  values: Array<StatsValueJSON>;
};

export type StatsItemRow = {
  statsItemID: string;
  name: string;
};

export class StatsItem extends Entity<StatsItemID> {
  private statsItemID: StatsItemID;
  private name: StatsItemName;
  private values: StatsValues;

  public static from(statsItemID: StatsItemID, name: StatsItemName, values: StatsValues): StatsItem {
    return new StatsItem(statsItemID, name, values);
  }

  public static fromJSON(json: StatsItemJSON): StatsItem {
    const {
      statsItemID,
      name,
      values
    } = json;

    return StatsItem.from(StatsItemID.of(statsItemID), StatsItemName.of(name), StatsValues.ofJSON(values));
  }

  public static fromRow(row: StatsItemRow, statsValues: StatsValues): StatsItem {
    const {
      statsItemID,
      name
    } = row;

    return StatsItem.from(StatsItemID.of(statsItemID), StatsItemName.of(name), statsValues);
  }

  public static default(): StatsItem {
    return StatsItem.from(StatsItemID.of(UUID.v4()), StatsItemName.default(), StatsValues.of([]));
  }

  private constructor(statsItemID: StatsItemID, name: StatsItemName, values: StatsValues) {
    super();
    this.statsItemID = statsItemID;
    this.name = name;
    this.values = values;
  }

  public getStatsItemID(): StatsItemID {
    return this.statsItemID;
  }

  public getName(): StatsItemName {
    return this.name;
  }

  public getValues(): StatsValues {
    return this.values;
  }

  public getIdentifier(): StatsItemID {
    return this.statsItemID;
  }

  public getAsOfs(): Array<moment.Moment> {
    return this.values.map<moment.Moment>((value: StatsValue): moment.Moment => {
      return value.getAsOf();
    });
  }

  public getValuesByColumn(column: Array<string>): Array<string> {
    const valuesByColumn: Array<string> = [];

    column.forEach((term: string): void => {
      let alreadyInput: boolean = false;

      this.values.forEach((statsValue: StatsValue): void => {
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
    this.values = this.values.set(statsValue);
  }

  public delete(asOf: moment.Moment): void {
    this.values = this.values.delete(asOf);
  }

  public isFilled(): boolean {
    const {
      name
    } = this;

    if (name.equals(StatsItemName.default())) {
      return false;
    }

    return true;
  }

  public isValid(): boolean {
    return this.isFilled();
  }

  public isSame(other: StatsItem): boolean {
    if (this === other) {
      return true;
    }
    if (!this.statsItemID.equals(other.getStatsItemID())) {
      return false;
    }
    if (!this.name.equals(other.getName())) {
      return false;
    }
    if (!this.values.equals(other.getValues())) {
      return false;
    }

    return true;
  }

  public copy(): StatsItem {
    const {
      statsItemID,
      name,
      values
    } = this;

    return new StatsItem(statsItemID, name, values.copy());
  }

  public toJSON(): StatsItemJSON {
    const {
      statsItemID,
      name,
      values
    } = this;

    return {
      statsItemID: statsItemID.get(),
      name: name.get(),
      values: values.toJSON()
    };
  }

  public toString(): string {
    const {
      statsItemID,
      name
    } = this;

    return `${statsItemID.toString()} ${name.toString()}`;
  }
}
