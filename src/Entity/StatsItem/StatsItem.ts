import { Project } from '@jamashita/publikum-collection';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/publikum-monad';
import { Entity } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { AsOf } from '../../VO/AsOf/AsOf';
import { AsOfs } from '../../VO/AsOf/AsOfs';
import { StatsItemDisplay } from '../../VO/Display/StatsItemDisplay';
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
    return StatsItemID.ofString(json.statsItemID)
      .map<StatsItem, StatsItemIDError | StatsValuesError>((statsItemID: StatsItemID) => {
        return StatsValues.ofJSON(json.values).map<StatsItem, StatsItemIDError | StatsValuesError>(
          (statsValues: StatsValues) => {
            return StatsItem.of(statsItemID, StatsItemName.of(json.name), statsValues);
          },
          StatsValuesError
        );
      })
      .recover((err: StatsItemIDError | StatsValuesError) => {
        throw new StatsItemError('StatsItem.ofJSON()', err);
      }, StatsItemError);
  }

  public static ofRow(
    row: StatsItemRow,
    project: Project<StatsItemID, StatsValues>
  ): Superposition<StatsItem, StatsItemError> {
    return StatsItemID.ofString(row.statsItemID)
      .map<StatsItem, StatsItemIDError>((statsItemID: StatsItemID) => {
        return Unscharferelation.maybe<StatsValues>(project.get(statsItemID))
          .toSuperposition()
          .map<StatsItem, UnscharferelationError>((values: StatsValues) => {
            return StatsItem.of(statsItemID, StatsItemName.of(row.name), values);
          })
          .recover<StatsItem, StatsItemIDError>(() => {
            return StatsItem.of(statsItemID, StatsItemName.of(row.name), StatsValues.empty());
          });
      })
      .recover<StatsItem, StatsItemError>((err: StatsItemIDError) => {
        throw new StatsItemError('StatsItem.ofRow()', err);
      }, StatsItemError);
  }

  public static isJSON(n: unknown): n is StatsItemJSON {
    if (!Kind.isObject<StatsItemJSON>(n)) {
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

  public display(): StatsItemDisplay {
    return StatsItemDisplay.of(this.statsItemID, this.name, this.values);
  }
}
