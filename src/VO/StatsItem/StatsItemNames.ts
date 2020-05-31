import { Collection, ImmutableSequence, Sequence } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { Quantum } from '@jamashita/publikum-monad';
import { Objet } from '@jamashita/publikum-object';
import { Mapper } from '@jamashita/publikum-type';

import { StatsItemName } from './StatsItemName';

export class StatsItemNames extends Objet implements Collection<number, StatsItemName>, JSONable {
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

  public get(index: number): Quantum<StatsItemName> {
    return this.names.get(index);
  }

  public contains(value: StatsItemName): boolean {
    return this.names.contains(value);
  }

  public size(): number {
    return this.names.size();
  }

  public map<U>(mapper: Mapper<StatsItemName, U>): Array<U> {
    return this.names.toArray().map<U>(mapper);
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
}
