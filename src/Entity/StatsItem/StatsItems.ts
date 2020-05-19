import {
  Alive,
  Cloneable,
  Collection,
  Dead,
  Enumerator,
  ImmutableSequence,
  JSONable,
  Kind,
  manoeuvre,
  Mapper,
  Objet,
  Project,
  Quantum,
  Sequence,
  Superposition
} from 'publikum';

import { AsOfs } from '../../VO/AsOf/AsOfs';
import { Column } from '../../VO/Coordinate/Column';
import { Row } from '../../VO/Coordinate/Row';
import { StatsItemError } from '../../VO/StatsItem/Error/StatsItemError';
import { StatsItemsError } from '../../VO/StatsItem/Error/StatsItemsError';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsItemName } from '../../VO/StatsItem/StatsItemName';
import { StatsItemNames } from '../../VO/StatsItem/StatsItemNames';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { StatsItem, StatsItemJSON, StatsItemRow } from './StatsItem';

export class StatsItems extends Objet implements Collection<number, StatsItem>, Cloneable<StatsItems>, JSONable {
  public readonly noun: 'StatsItems' = 'StatsItems';
  private readonly items: Sequence<StatsItem>;

  private static readonly EMPTY: StatsItems = new StatsItems(ImmutableSequence.empty<StatsItem>());

  public static of(items: Sequence<StatsItem>): StatsItems {
    if (items.isEmpty()) {
      return StatsItems.empty();
    }

    return new StatsItems(items);
  }

  public static ofArray(items: Array<StatsItem>): StatsItems {
    return StatsItems.of(ImmutableSequence.of<StatsItem>(items));
  }

  public static ofSpread(...items: Array<StatsItem>): StatsItems {
    return StatsItems.ofArray(items);
  }

  public static ofSuperposition(
    superpositions: Array<Superposition<StatsItem, StatsItemError>>
  ): Superposition<StatsItems, StatsItemsError> {
    return manoeuvre<StatsItem, StatsItemError>(superpositions).match<StatsItems, StatsItemsError>(
      (statsItems: Array<StatsItem>) => {
        return Alive.of<StatsItems, StatsItemsError>(StatsItems.ofArray(statsItems));
      },
      (err: StatsItemError) => {
        return Dead.of<StatsItems, StatsItemsError>(new StatsItemsError('StatsItems.ofSuperposition()', err));
      }
    );
  }

  public static ofJSON(json: Array<StatsItemJSON>): Superposition<StatsItems, StatsItemsError> {
    const superpositions: Array<Superposition<StatsItem, StatsItemError>> = json.map<
      Superposition<StatsItem, StatsItemError>
    >((statsItemJSON: StatsItemJSON) => {
      return StatsItem.ofJSON(statsItemJSON);
    });

    return StatsItems.ofSuperposition(superpositions);
  }

  public static ofRow(
    rows: Array<StatsItemRow>,
    project: Project<StatsItemID, StatsValues>
  ): Superposition<StatsItems, StatsItemsError> {
    const superpositions: Array<Superposition<StatsItem, StatsItemError>> = rows.map<
      Superposition<StatsItem, StatsItemError>
    >((statsItemRow: StatsItemRow) => {
      return StatsItem.ofRow(statsItemRow, project);
    });

    return StatsItems.ofSuperposition(superpositions);
  }

  public static isJSON(n: unknown): n is Array<StatsItemJSON> {
    if (!Kind.isArray(n)) {
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
    super();
    this.items = items;
  }

  public add(...statsItem: Array<StatsItem>): StatsItems {
    if (statsItem.length === 0) {
      return this;
    }

    return StatsItems.of(this.items.add(...statsItem));
  }

  public get(index: number): Quantum<StatsItem> {
    return this.items.get(index);
  }

  public getNames(): StatsItemNames {
    return StatsItemNames.of(
      this.items.map<StatsItemName>((item: StatsItem) => {
        return item.getName();
      })
    );
  }

  public getAsOfs(): AsOfs {
    const all: Array<AsOfs> = this.items.toArray().map<AsOfs>((item: StatsItem) => {
      return item.getAsOfs();
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

    const newItems: Array<StatsItem> = [...items.slice(0, toValue), statsItem, ...items.slice(toValue + 1)];

    return StatsItems.ofArray(newItems);
  }

  public remove(statsItem: StatsItem): StatsItems {
    const items: Sequence<StatsItem> = this.items.filter((item: StatsItem) => {
      const eq: boolean = item.equals(statsItem);

      return !eq;
    });

    if (items.isEmpty()) {
      return StatsItems.empty();
    }

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

  public duplicate(): StatsItems {
    if (this.isEmpty()) {
      return StatsItems.empty();
    }

    return StatsItems.of(this.items.duplicate());
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
    if (this.items.size() !== other.size()) {
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

  public serialize(): string {
    return this.items.toString();
  }
}