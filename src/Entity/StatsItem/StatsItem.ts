import { Project } from '@jamashita/publikum-collection';
import { Entity } from '@jamashita/publikum-object';
import { Kind, Nullable } from '@jamashita/publikum-type';
import { AsOf } from '../../VO/AsOf/AsOf';
import { AsOfs } from '../../VO/AsOf/AsOfs';
import { NoValue } from '../../VO/NumericalValue/NoValue';
import { NumericalValues } from '../../VO/NumericalValue/NumericalValues';
import { StatsItemError } from '../../VO/StatsItem/Error/StatsItemError';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsItemName } from '../../VO/StatsItem/StatsItemName';
import { StatsValueError } from '../../VO/StatsValue/Error/StatsValueError';
import { StatsValue, StatsValueJSON } from '../../VO/StatsValue/StatsValue';
import { StatsValues } from '../../VO/StatsValue/StatsValues';

export type StatsItemJSON = Readonly<{
  statsItemID: string;
  name: string;
  values: Array<StatsValueJSON>;
}>;
export type StatsItemRow = Readonly<{
  statsItemID: string;
  name: string;
}>;

export class StatsItem extends Entity<StatsItemID, StatsItem> {
  public readonly noun: 'StatsItem' = 'StatsItem';
  private readonly statsItemID: StatsItemID;
  private readonly name: StatsItemName;
  private values: StatsValues;

  public static of(statsItemID: StatsItemID, name: StatsItemName, values: StatsValues): StatsItem {
    return new StatsItem(statsItemID, name, values);
  }

  public static ofJSON(json: StatsItemJSON): StatsItem {
    try {
      return StatsItem.of(
        StatsItemID.ofString(json.statsItemID),
        StatsItemName.of(json.name),
        StatsValues.ofJSON(json.values)
      );
    }
    catch (err: unknown) {
      if (err instanceof StatsValueError) {
        throw new StatsItemError('StatsItem.ofJSON()', err);
      }

      throw err;
    }
  }

  public static ofRow(row: StatsItemRow, project: Project<StatsItemID, StatsValues>): StatsItem {
    try {
      const statsItemID: StatsItemID = StatsItemID.ofString(row.statsItemID);
      const values: Nullable<StatsValues> = project.get(statsItemID);

      if (Kind.isNull(values)) {
        return StatsItem.of(
          statsItemID,
          StatsItemName.of(row.name),
          StatsValues.empty()
        );
      }

      return StatsItem.of(
        statsItemID,
        StatsItemName.of(row.name),
        values
      );
    }
    catch (err: unknown) {
      if (err instanceof StatsValueError) {
        throw new StatsItemError('StatsItem.ofRow()', err);
      }

      throw err;
    }
  }

  public static validate(n: unknown): n is StatsItemJSON {
    if (!Kind.isObject<StatsItemJSON>(n)) {
      return false;
    }
    if (!Kind.isString(n.statsItemID)) {
      return false;
    }
    if (!Kind.isString(n.name)) {
      return false;
    }
    if (!StatsValues.validate(n.values)) {
      return false;
    }

    return true;
  }

  public static default(): StatsItem {
    return StatsItem.of(StatsItemID.generate(), StatsItemName.empty(), StatsValues.empty());
  }

  protected constructor(statsItemID: StatsItemID, name: StatsItemName, values: StatsValues) {
    super();
    this.statsItemID = statsItemID;
    this.name = name;
    this.values = values;
  }

  public getIdentifier(): StatsItemID {
    return this.statsItemID;
  }

  public duplicate(): StatsItem {
    return new StatsItem(this.statsItemID, this.name, this.values.duplicate());
  }

  public toJSON(): StatsItemJSON {
    return {
      statsItemID: this.statsItemID.get().get(),
      name: this.name.get(),
      values: this.values.toJSON()
    };
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

  public getAsOfs(): AsOfs {
    return this.values.getAsOfs();
  }

  public set(statsValue: StatsValue): void {
    this.values = this.values.set(statsValue);
  }

  public delete(asOf: AsOf): void {
    this.values = this.values.delete(asOf);
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

  public same(other: StatsItem): boolean {
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
}
