import { Project } from '@jamashita/publikum-collection';
import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';
import { Entity } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { AsOf } from '../../VO/AsOf/AsOf';
import { AsOfs } from '../../VO/AsOf/AsOfs';
import { NoValue } from '../../VO/NumericalValue/NoValue';
import { NumericalValues } from '../../VO/NumericalValue/NumericalValues';
import { StatsItemError } from '../../VO/StatsItem/Error/StatsItemError';
import { StatsItemIDError } from '../../VO/StatsItem/Error/StatsItemIDError';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsItemName } from '../../VO/StatsItem/StatsItemName';
import { StatsValuesError } from '../../VO/StatsValue/Error/StatsValuesError';
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

  public static ofJSON(json: StatsItemJSON): Superposition<StatsItem, StatsItemError> {
    return StatsItemID.ofString(json.statsItemID).transform<StatsItem, StatsItemError>(
      (statsItemID: StatsItemID) => {
        return StatsValues.ofJSON(json.values).transform<StatsItem, StatsItemError>(
          (statsValues: StatsValues) => {
            return Alive.of<StatsItem, StatsItemError>(
              StatsItem.of(statsItemID, StatsItemName.of(json.name), statsValues)
            );
          },
          (err: StatsValuesError) => {
            return Dead.of<StatsItem, StatsItemError>(new StatsItemError('StatsItem.ofJSON()', err));
          }
        );
      },
      (err: StatsItemIDError) => {
        return Dead.of<StatsItem, StatsItemError>(new StatsItemError('StatsItem.ofJSON()', err));
      }
    );
  }

  public static ofRow(
    row: StatsItemRow,
    project: Project<StatsItemID, StatsValues>
  ): Superposition<StatsItem, StatsItemError> {
    return StatsItemID.ofString(row.statsItemID).transform<StatsItem, StatsItemError>(
      (statsItemID: StatsItemID) => {
        const values: StatsValues = project.get(statsItemID).getOrElse(StatsValues.empty());

        return Alive.of<StatsItem, StatsItemError>(StatsItem.of(statsItemID, StatsItemName.of(row.name), values));
      },
      (err: StatsItemIDError) => {
        return Dead.of<StatsItem, StatsItemError>(new StatsItemError('StatsItem.ofRow()', err));
      }
    );
  }

  public static isJSON(n: unknown): n is StatsItemJSON {
    if (!Kind.isPlainObject(n)) {
      return false;
    }
    if (!Kind.isString(n.statsItemID)) {
      return false;
    }
    if (!Kind.isString(n.name)) {
      return false;
    }
    if (!StatsValues.isJSON(n.values)) {
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

  public set(statsValue: StatsValue): void {
    this.values = this.values.set(statsValue);
  }

  public delete(asOf: AsOf): void {
    this.values = this.values.delete(asOf);
  }

  public isFilled(): boolean {
    return !this.name.isEmpty();
  }

  public isValid(): boolean {
    return this.isFilled();
  }

  public isSame(other: StatsItem): boolean {
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
}
