import { StatsItemError } from '../veau-error/StatsItemError';
import { StatsItemIDError } from '../veau-error/StatsItemIDError';
import { StatsItemsError } from '../veau-error/StatsItemsError';
import { Cloneable } from '../veau-general/Cloneable';
import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Enumerator } from '../veau-general/Type/Enumerator';
import { Mapper } from '../veau-general/Type/Mapper';
import { Type } from '../veau-general/Type/Type';
import { AsOf } from '../veau-vo/AsOf';
import { AsOfs } from '../veau-vo/AsOfs';
import { Column } from '../veau-vo/Column';
import { Row } from '../veau-vo/Row';
import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsItemName } from '../veau-vo/StatsItemName';
import { StatsItemNames } from '../veau-vo/StatsItemNames';
import { StatsValues } from '../veau-vo/StatsValues';
import { StatsItem, StatsItemJSON, StatsItemRow } from './StatsItem';

export class StatsItems implements Collection<number, StatsItem>, JSONable, Cloneable {
  public readonly noun: 'StatsItems' = 'StatsItems';
  private readonly items: Array<StatsItem>;

  public static of(items: Array<StatsItem>): StatsItems {
    return new StatsItems(items);
  }

  public static ofTry(tries: Array<Try<StatsItem, StatsItemError>>): Try<StatsItems, StatsItemsError> {
    const failures: Array<Failure<StatsItem, StatsItemError>> = tries.filter((trial: Try<StatsItem, StatsItemError>): trial is Failure<StatsItem, StatsItemError> => {
      return trial.isFailure();
    });

    if (failures.length !== 0) {
      const message: string = failures.map<string>((failure: Failure<StatsItem, StatsItemError>) => {
        return failure.getMessage();
      }).join(': ');

      return Failure.of<StatsItems, StatsItemsError>(new StatsItemsError(message));
    }

    const items: Array<StatsItem> = tries.map<StatsItem>((trial: Try<StatsItem, StatsItemError>) => {
      return trial.get();
    });

    return Success.of<StatsItems, StatsItemsError>(StatsItems.of(items));
  }

  public static ofJSON(json: Array<StatsItemJSON>):  Try<StatsItems, StatsItemsError> {
    const trials: Array<Try<StatsItem, StatsItemError>> = json.map<Try<StatsItem, StatsItemError>>((item: StatsItemJSON) => {
      return StatsItem.ofJSON(item);
    });

    return StatsItems.ofTry(trials);
  }

  public static ofRow(statsItemRows: Array<StatsItemRow>, statsValues: StatsValues): Try<StatsItems, StatsItemsError> {
    const trials: Array<Try<StatsItem, StatsItemError>> = statsItemRows.map<Try<StatsItem, StatsItemError>>((statsItemRow: StatsItemRow) => {
      return StatsItemID.of(statsItemRow.statsItemID).match<Try<StatsItem, StatsItemError>>((statsItemID: StatsItemID) => {
        const values: StatsValues = statsValues.filter(statsItemID);

        return StatsItem.ofRow(statsItemRow, values);
      }, (err: StatsItemIDError) => {
        return Failure.of<StatsItem, StatsItemError>(new StatsItemError(err.message));
      });

    });

    return StatsItems.ofTry(trials);
  }

  public static isJSON(n: unknown): n is Array<StatsItemJSON> {
    if (!Type.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return StatsItem.isJSON(o);
    });
  }

  public static empty(): StatsItems {
    return StatsItems.of([]);
  }

  private constructor(items: Array<StatsItem>) {
    this.items = items;
  }

  public add(statsItem: StatsItem): StatsItems {
    return new StatsItems([
      ...this.items,
      statsItem
    ]);
  }

  public get(index: number): Optional<StatsItem> {
    const statsItem: StatsItem | undefined = this.items[index];

    if (statsItem === undefined) {
      return None.of<StatsItem>();
    }

    return Some.of<StatsItem>(statsItem);
  }

  public getNames(): StatsItemNames {
    return StatsItemNames.of(this.items.map<StatsItemName>((item: StatsItem) => {
      return item.getName();
    }));
  }

  public getAsOfs(): AsOfs {
    const asOfs: Array<AsOf> = [];

    this.items.forEach((item: StatsItem) => {
      item.getAsOfs().forEach((asOf: AsOf) => {
        asOfs.push(asOf);
      });
    });

    return AsOfs.of(asOfs);
  }

  public maxNameLength(): number {
    if (this.isEmpty()) {
      return 0;
    }

    const lengths: Array<number> = this.items.map<number>((item: StatsItem) => {
      return item.getName().length();
    });

    return Math.max(...lengths);
  }

  public move(from: Column, to: Column): StatsItems {
    const {
      items
    } = this;

    const fromValue: number = from.get();
    const toValue: number = to.get();
    const min: number = Math.min(fromValue, toValue);
    const max: number = Math.max(fromValue, toValue);

    const newItems: Array<StatsItem> = [
      ...items.slice(0, min),
      items[max],
      ...items.slice(min + 1, max),
      items[min],
      ...items.slice(max + 1)
    ];

    return new StatsItems(newItems);
  }

  public replace(statsItem: StatsItem, to: Row): StatsItems {
    const {
      items
    } = this;

    const toValue: number = to.get();

    const newItems: Array<StatsItem> = [
      ...items.slice(0, toValue),
      statsItem,
      ...items.slice(toValue + 1)
    ];

    return new StatsItems(newItems);
  }

  public remove(statsItem: StatsItem): StatsItems {
    const items: Array<StatsItem> = this.items.filter((item: StatsItem) => {
      return !item.equals(statsItem);
    });

    return new StatsItems(items);
  }

  public contains(value: StatsItem): boolean {
    const found: StatsItem | undefined = this.items.find((item: StatsItem) => {
      return value.equals(item);
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.items.length;
  }

  public forEach(iteration: Enumerator<number, StatsItem>): void {
    this.items.forEach(iteration);
  }

  public map<U>(mapper: Mapper<StatsItem, U>): Array<U> {
    return this.items.map<U>(mapper);
  }

  public areFilled(): boolean {
    return this.items.every((statsItem: StatsItem) => {
      return statsItem.isFilled();
    });
  }

  public areValid(): boolean {
    return this.areFilled();
  }

  public haveValues(): boolean {
    const {
      items
    } = this;

    if (items.length === 0) {
      return false;
    }

    const rowLengths: Array<number> = items.map<number>((item: StatsItem) => {
      return item.getValues().size();
    });

    const values: number = Math.max(...rowLengths);

    if (values === 0) {
      return false;
    }

    return true;
  }

  public copy(): StatsItems {
    return new StatsItems(this.items.map<StatsItem>((statsItem: StatsItem) => {
      return statsItem.copy();
    }));
  }

  public isEmpty(): boolean {
    if (this.items.length === 0) {
      return true;
    }

    return false;
  }

  public equals(other: StatsItems): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.items.length;
    if (length !== other.size()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (!this.items[i].equals(other.get(i).get())) {
        return false;
      }
    }

    return true;
  }

  public areSame(other: StatsItems): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.items.length;
    if (length !== other.size()) {
      return false;
    }

    for (let i: number = 0; i < length; i++) {
      if (!this.items[i].isSame(other.get(i).get())) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): Array<StatsItemJSON> {
    return this.items.map<StatsItemJSON>((item: StatsItem) => {
      return item.toJSON();
    });
  }

  public toString(): string {
    return this.items.map<string>((item: StatsItem) => {
      return item.toString();
    }).join(', ');
  }
}
