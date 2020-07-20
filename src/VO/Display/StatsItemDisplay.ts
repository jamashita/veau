import { ValueObject } from '@jamashita/publikum-object';

import { AsOf } from '../AsOf/AsOf';
import { AsOfs } from '../AsOf/AsOfs';
import { NoValue } from '../NumericalValue/NoValue';
import { NumericalValues } from '../NumericalValue/NumericalValues';
import { StatsItemID } from '../StatsItem/StatsItemID';
import { StatsItemName } from '../StatsItem/StatsItemName';
import { StatsValue } from '../StatsValue/StatsValue';
import { StatsValues } from '../StatsValue/StatsValues';

export class StatsItemDisplay extends ValueObject<StatsItemDisplay> {
  public readonly noun: 'StatsItemDisplay' = 'StatsItemDisplay';
  private readonly statsItemID: StatsItemID;
  private readonly name: StatsItemName;
  private values: StatsValues;

  public static of(statsItemID: StatsItemID, name: StatsItemName, values: StatsValues): StatsItemDisplay {
    return new StatsItemDisplay(statsItemID, name, values);
  }

  protected constructor(statsItemID: StatsItemID, name: StatsItemName, values: StatsValues) {
    super();
    this.statsItemID = statsItemID;
    this.name = name;
    this.values = values;
  }

  public equals(other: StatsItemDisplay): boolean {
    if (this === other) {
      return true;
    }
    if (!this.statsItemID.equals(other.statsItemID)) {
      return false;
    }
    if (!this.name.equals(other.name)) {
      return false;
    }
    if (!this.values.equals(other.values)) {
      return false;
    }

    return true;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.statsItemID.toString());
    properties.push(this.name.toString());
    properties.push(this.values.toString());

    return properties.join(' ');
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

  public getAsOfs(): AsOfs {
    return this.values.getAsOfs();
  }

  public getValuesByColumn(columns: AsOfs): NumericalValues {
    let valuesByColumn: NumericalValues = NumericalValues.empty();

    columns.forEach((column: AsOf) => {
      let alreadyInput: boolean = false;

      this.values.forEach((statsValue: StatsValue) => {
        if (alreadyInput) {
          return;
        }
        if (column.equals(statsValue.getAsOf())) {
          valuesByColumn = valuesByColumn.add(statsValue.getValue());
          alreadyInput = true;
        }
      });
      if (!alreadyInput) {
        valuesByColumn = valuesByColumn.add(NoValue.of());
      }
    });

    return valuesByColumn;
  }

  public isFilled(): boolean {
    return !this.name.isEmpty();
  }
}
