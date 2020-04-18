import { StatsItemError } from '../Error/StatsItemError';
import { StatsItemIDError } from '../Error/StatsItemIDError';
import { StatsValuesError } from '../Error/StatsValuesError';
import { Entity } from '../General/Object/Entity';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Type } from '../General/Type/Type';
import { AsOf } from '../VO/AsOf';
import { AsOfs } from '../VO/AsOfs';
import { NoValue } from '../VO/NoValue';
import { NumericalValues } from '../VO/NumericalValues';
import { StatsItemID } from '../VO/StatsItemID';
import { StatsItemName } from '../VO/StatsItemName';
import { StatsValue, StatsValueJSON } from '../VO/StatsValue';
import { StatsValues } from '../VO/StatsValues';

export type StatsItemJSON = Readonly<{
  statsItemID: string;
  name: string;
  values: Array<StatsValueJSON>;
}>;
export type StatsItemRow = Readonly<{
  statsItemID: string;
  name: string;
}>;

export class StatsItem extends Entity<StatsItemID> {
  public readonly noun: 'StatsItem' = 'StatsItem';
  private readonly statsItemID: StatsItemID;
  private readonly name: StatsItemName;
  private values: StatsValues;

  public static of(
    statsItemID: StatsItemID,
    name: StatsItemName,
    values: StatsValues
  ): StatsItem {
    return new StatsItem(statsItemID, name, values);
  }

  public static ofJSON(json: StatsItemJSON): Superposition<StatsItem, StatsItemError> {
    return StatsItemID.ofString(json.statsItemID).match<StatsItem, StatsItemError>((statsItemID: StatsItemID) => {
      return StatsValues.ofJSON(statsItemID, json.values).match<StatsItem, StatsItemError>((statsValues: StatsValues) => {
        return Success.of<StatsItem, StatsItemError>(
          StatsItem.of(
            statsItemID,
            StatsItemName.of(json.name),
            statsValues
          )
        );
      }, (err: StatsValuesError) => {
        return Failure.of<StatsItem, StatsItemError>(new StatsItemError('StatsItem.ofJSON()', err));
      });
    }, (err: StatsItemIDError) => {
      return Failure.of<StatsItem, StatsItemError>(new StatsItemError('StatsItem.ofJSON()', err));
    });
  }

  public static ofRow(row: StatsItemRow, statsValues: StatsValues): Superposition<StatsItem, StatsItemError> {
    return StatsItemID.ofString(row.statsItemID).match<StatsItem, StatsItemError>((statsItemID: StatsItemID) => {
      return Success.of<StatsItem, StatsItemError>(
        StatsItem.of(
          statsItemID,
          StatsItemName.of(row.name),
          statsValues
        )
      );
    }, (err: StatsItemIDError) => {
      return Failure.of<StatsItem, StatsItemError>(new StatsItemError('StatsItem.ofRow()', err));
    });
  }

  public static isJSON(n: unknown): n is StatsItemJSON {
    if (!Type.isPlainObject(n)) {
      return false;
    }
    if (!Type.isString(n.statsItemID)) {
      return false;
    }
    if (!Type.isString(n.name)) {
      return false;
    }
    if (!StatsValues.isJSON(n.values)) {
      return false;
    }

    return true;
  }

  public static default(): StatsItem {
    return StatsItem.of(
      StatsItemID.generate(),
      StatsItemName.empty(),
      StatsValues.empty()
    );
  }

  protected constructor(
    statsItemID: StatsItemID,
    name: StatsItemName,
    values: StatsValues
  ) {
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
          return;
        }
      });
      if (!alreadyInput) {
        valuesByColumn = valuesByColumn.add(NoValue.of());
      }
    });

    return valuesByColumn;
  }

  public setValue(statsValue: StatsValue): void {
    this.values = this.values.set(statsValue);
  }

  public delete(asOf: AsOf): void {
    this.values = this.values.delete(asOf);
  }

  public isFilled(): boolean {
    return !this.name.equals(StatsItemName.empty());
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
    return new StatsItem(
      this.statsItemID,
      this.name,
      this.values.duplicate()
    );
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
