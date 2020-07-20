import { CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper, Nullable } from '@jamashita/publikum-type';

import { StatsItemName } from './StatsItemName';

export class StatsItemNames extends Quantity<StatsItemNames, number, StatsItemName, 'StatsItemNames'>
  implements JSONable<Array<string>> {
  public readonly noun: 'StatsItemNames' = 'StatsItemNames';
  private readonly names: Sequence<StatsItemName>;
  private static readonly EMPTY: StatsItemNames = new StatsItemNames(ImmutableSequence.empty<StatsItemName>());

  public static of(names: Sequence<StatsItemName>): StatsItemNames {
    if (names.isEmpty()) {
      return StatsItemNames.empty();
    }

    return new StatsItemNames(names);
  }

  public static ofArray(names: Array<StatsItemName>): StatsItemNames {
    return StatsItemNames.of(ImmutableSequence.of<StatsItemName>(names));
  }

  public static ofSpread(...names: Array<StatsItemName>): StatsItemNames {
    return StatsItemNames.ofArray(names);
  }

  public static empty(): StatsItemNames {
    return StatsItemNames.EMPTY;
  }

  protected constructor(names: Sequence<StatsItemName>) {
    super();
    this.names = names;
  }

  public get(index: number): Nullable<StatsItemName> {
    return this.names.get(index);
  }

  public contains(value: StatsItemName): boolean {
    return this.names.contains(value);
  }

  public size(): number {
    return this.names.size();
  }

  public forEach(iteration: CancellableEnumerator<number, StatsItemName>): void {
    this.names.forEach(iteration);
  }

  public isEmpty(): boolean {
    return this.names.isEmpty();
  }

  public equals(other: StatsItemNames): boolean {
    if (this === other) {
      return true;
    }

    return this.names.equals(other.names);
  }

  public toJSON(): Array<string> {
    return this.names.toArray().map<string>((name: StatsItemName) => {
      return name.get();
    });
  }

  public serialize(): string {
    return this.names.toString();
  }

  public map<U>(mapper: Mapper<StatsItemName, U>): Array<U> {
    const array: Array<U> = [];
    let i: number = 0;

    this.forEach((item: StatsItemName) => {
      array.push(mapper(item, i));
      i++;
    });

    return array;
  }

  public [Symbol.iterator](): Iterator<Pair<number, StatsItemName>> {
    return this.names[Symbol.iterator]();
  }

  public every(predicate: BinaryPredicate<StatsItemName, number>): boolean {
    return this.names.every(predicate);
  }

  public some(predicate: BinaryPredicate<StatsItemName, number>): boolean {
    return this.names.some(predicate);
  }
}
