import { StatsItemError } from '../veau-error/StatsItemError';
import { StatsItemIDError } from '../veau-error/StatsItemIDError';
import { StatsValuesError } from '../veau-error/StatsValuesError';
import { Entity } from '../veau-general/Entity';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Type } from '../veau-general/Type/Type';
import { AsOf } from '../veau-vo/AsOf';
import { AsOfs } from '../veau-vo/AsOfs';
import { NoValue } from '../veau-vo/NoValue';
import { NumericalValues } from '../veau-vo/NumericalValues';
import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsItemName } from '../veau-vo/StatsItemName';
import { StatsValue, StatsValueJSON } from '../veau-vo/StatsValue';
import { StatsValues } from '../veau-vo/StatsValues';

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

  public static of(statsItemID: StatsItemID, name: StatsItemName, values: StatsValues): StatsItem {
    return new StatsItem(statsItemID, name, values);
  }

  public static ofJSON(json: StatsItemJSON): Try<StatsItem, StatsItemError> {
    const {
      statsItemID,
      name,
      values
    } = json;

    return StatsItemID.ofString(statsItemID).match<Try<StatsItem, StatsItemError>>((id: StatsItemID) => {
      return StatsValues.ofJSON(id, values).match<Try<StatsItem, StatsItemError>>((v: StatsValues) => {
        return Success.of<StatsItem, StatsItemError>(StatsItem.of(id, StatsItemName.of(name), v));
      }, (err: StatsValuesError) => {
        return Failure.of<StatsItem, StatsItemError>(new StatsItemError(err.message));
      });
    }, (err: StatsItemIDError) => {
      return Failure.of<StatsItem, StatsItemError>(new StatsItemError(err.message));
    });
  }

  public static ofRow(row: StatsItemRow, statsValues: StatsValues): Try<StatsItem, StatsItemError> {
    const {
      statsItemID,
      name
    } = row;

    return StatsItemID.ofString(statsItemID).match<Try<StatsItem, StatsItemError>>((id: StatsItemID) => {
      return Success.of<StatsItem, StatsItemError>(StatsItem.of(id, StatsItemName.of(name), statsValues));
    }, (err: StatsItemIDError) => {
      return Failure.of<StatsItem, StatsItemError>(new StatsItemError(err.message));
    });
  }

  public static isJSON(n: unknown): n is StatsItemJSON {
    if (!Type.isPlainObject(n)) {
      return false;
    }

    const {
      statsItemID,
      name,
      values
    } = n;

    if (!Type.isString(statsItemID)) {
      return false;
    }
    if (!Type.isString(name)) {
      return false;
    }
    if (!StatsValues.isJSON(values)) {
      return false;
    }

    return true;
  }

  public static default(): StatsItem {
    return StatsItem.of(StatsItemID.generate(), StatsItemName.default(), StatsValues.empty());
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
    if (this.name.equals(StatsItemName.default())) {
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

    const {
      statsItemID,
      name,
      values
    } = this;

    if (!statsItemID.equals(other.getStatsItemID())) {
      return false;
    }
    if (!name.equals(other.getName())) {
      return false;
    }
    if (!values.equals(other.getValues())) {
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
      statsItemID: statsItemID.get().get(),
      name: name.get(),
      values: values.toJSON()
    };
  }

  public toString(): string {
    const {
      statsItemID,
      name,
      values
    } = this;

    return `${statsItemID.toString()} ${name.toString()} ${values.toString()}`;
  }
}
