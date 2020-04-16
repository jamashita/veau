import { StatsItemError } from '../Error/StatsItemError';
import { StatsItemIDError } from '../Error/StatsItemIDError';
import { StatsItemsError } from '../Error/StatsItemsError';
import { ImmutableSequence } from '../General/Collection/Sequence/ImmutableSequence';
import { Sequence } from '../General/Collection/Sequence/Interface/Sequence';
import { Cloneable } from '../General/Interface/Cloneable';
import { Collection } from '../General/Interface/Collection';
import { JSONable } from '../General/Interface/JSONable';
import { Quantum } from '../General/Quantum/Quantum';
import { Failure } from '../General/Superposition/Failure';
import { manoeuvre } from '../General/Superposition/Manoeuvre';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Enumerator, Mapper } from '../General/Type/Function';
import { Type } from '../General/Type/Type';
import { AsOfs } from '../VO/AsOfs';
import { Column } from '../VO/Column';
import { Row } from '../VO/Row';
import { StatsItemID } from '../VO/StatsItemID';
import { StatsItemName } from '../VO/StatsItemName';
import { StatsItemNames } from '../VO/StatsItemNames';
import { StatsValues } from '../VO/StatsValues';
import { StatsItem, StatsItemJSON, StatsItemRow } from './StatsItem';

export class StatsItems implements Collection<number, StatsItem>, JSONable, Cloneable {
  public readonly noun: 'StatsItems' = 'StatsItems';
  private readonly items: Sequence<StatsItem>;

  private static readonly EMPTY: StatsItems = StatsItems.of(ImmutableSequence.empty<StatsItem>());

  public static of(items: Sequence<StatsItem>): StatsItems {
    return new StatsItems(items);
  }

  public static ofArray(items: Array<StatsItem>): StatsItems {
    return StatsItems.of(ImmutableSequence.of<StatsItem>(items));
  }

  public static ofSpread(...items: Array<StatsItem>): StatsItems {
    return StatsItems.ofArray(items);
  }

  public static ofTry(superpositions: Array<Superposition<StatsItem, StatsItemError>>): Superposition<StatsItems, StatsItemsError> {
    return manoeuvre<StatsItem, StatsItemError>(superpositions).match<StatsItems, StatsItemsError>((statsItems: Array<StatsItem>) => {
      return Success.of<StatsItems, StatsItemsError>(StatsItems.ofArray(statsItems));
    }, (err: StatsItemError) => {
      return Failure.of<StatsItems, StatsItemsError>(new StatsItemsError('StatsItems.ofTry()', err));
    });
  }

  public static ofJSON(json: Array<StatsItemJSON>):  Superposition<StatsItems, StatsItemsError> {
    const trials: Array<Superposition<StatsItem, StatsItemError>> = json.map<Superposition<StatsItem, StatsItemError>>((statsItemJSON: StatsItemJSON) => {
      return StatsItem.ofJSON(statsItemJSON);
    });

    return StatsItems.ofTry(trials);
  }

  public static ofRow(rows: Array<StatsItemRow>, statsValues: StatsValues): Superposition<StatsItems, StatsItemsError> {
    const trials: Array<Superposition<StatsItem, StatsItemError>> = rows.map<Superposition<StatsItem, StatsItemError>>((statsItemRow: StatsItemRow) => {
      return StatsItemID.ofString(statsItemRow.statsItemID).match<StatsItem, StatsItemError>((statsItemID: StatsItemID) => {
        const values: StatsValues = statsValues.filter(statsItemID);

        return StatsItem.ofRow(statsItemRow, values);
      }, (err: StatsItemIDError) => {
        return Failure.of<StatsItem, StatsItemError>(new StatsItemError('StatsItems.ofRow()', err));
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
    return StatsItems.EMPTY;
  }

  protected constructor(items: Sequence<StatsItem>) {
    this.items = items;
  }

  public add(...statsItem: Array<StatsItem>): StatsItems {
    return StatsItems.of(this.items.add(...statsItem));
  }

  public get(index: number): Quantum<StatsItem> {
    return this.items.get(index);
  }

  public getNames(): StatsItemNames {
    return StatsItemNames.of(this.items.map<StatsItemName>((item: StatsItem) => {
      return item.getName();
    }));
  }

  public getAsOfs(): AsOfs {
    const sequence: Sequence<AsOfs> = this.items.map<AsOfs>((item: StatsItem) => {
      return item.getAsOfs();
    });

    const all: Array<AsOfs> = [];

    sequence.forEach((asOfs: AsOfs) => {
      all.push(asOfs);
    });

    return AsOfs.merge(...all);
  }

  public maxNameLength(): number {
    if (this.isEmpty()) {
      return 0;
    }

    const lengths: Array<number> = this.items.toArray().map<number>((item: StatsItem) => {
      return item.getName().length();
    });

    return Math.max(...lengths);
  }

  public move(from: Column, to: Column): StatsItems {
    const items: Array<StatsItem> = this.items.toArray();

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

    return StatsItems.ofArray(newItems);
  }

  public replace(statsItem: StatsItem, to: Row): StatsItems {
    const items: Array<StatsItem> = this.items.toArray();

    const toValue: number = to.get();

    const newItems: Array<StatsItem> = [
      ...items.slice(0, toValue),
      statsItem,
      ...items.slice(toValue + 1)
    ];

    return StatsItems.ofArray(newItems);
  }

  public remove(statsItem: StatsItem): StatsItems {
    const items: Sequence<StatsItem> = this.items.filter((item: StatsItem) => {
      return !item.equals(statsItem);
    });

    return StatsItems.of(items);
  }

  public contains(value: StatsItem): boolean {
    return this.items.contains(value);
  }

  public size(): number {
    return this.items.size();
  }

  public forEach(iteration: Enumerator<number, StatsItem>): void {
    this.items.forEach(iteration);
  }

  public map<U>(mapper: Mapper<StatsItem, U>): Array<U> {
    return this.items.toArray().map<U>(mapper);
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
    if (this.items.isEmpty()) {
      return false;
    }

    const rowLengths: Array<number> = this.items.toArray().map<number>((item: StatsItem) => {
      return item.getValues().size();
    });

    const values: number = Math.max(...rowLengths);

    if (values === 0) {
      return false;
    }

    return true;
  }

  public copy(): StatsItems {
    return StatsItems.of(this.items.copy());
  }

  public isEmpty(): boolean {
    return this.items.isEmpty();
  }

  public equals(other: StatsItems): boolean {
    if (this === other) {
      return true;
    }

    return this.items.equals(other.items);
  }

  public areSame(other: StatsItems): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.items.size();
    if (length !== other.size()) {
      return false;
    }

    return this.items.every((item: StatsItem, index: number) => {
      return item.isSame(other.get(index).get());
    });
  }

  public toJSON(): Array<StatsItemJSON> {
    return this.items.toArray().map<StatsItemJSON>((item: StatsItem) => {
      return item.toJSON();
    });
  }

  public toString(): string {
    return this.items.toArray().map<string>((item: StatsItem) => {
      return item.toString();
    }).join(', ');
  }
}
