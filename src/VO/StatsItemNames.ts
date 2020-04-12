import { Collection } from '../General/Interface/Collection';
import { Sequence } from '../General/Collection/Sequence';
import { JSONable } from '../General/Interface/JSONable';
import { Optional } from '../General/Optional/Optional';
import { Mapper } from '../General/Type/Function';
import { StatsItemName } from './StatsItemName';

export class StatsItemNames implements Collection<number, StatsItemName>, JSONable {
  public readonly noun: 'StatsItemNames' = 'StatsItemNames';
  private readonly names: Sequence<StatsItemName>;

  public static of(names: Sequence<StatsItemName>): StatsItemNames {
    return new StatsItemNames(names);
  }

  public static ofArray(names: Array<StatsItemName>): StatsItemNames {
    return StatsItemNames.of(Sequence.of<StatsItemName>(names));
  }

  public static ofSpread(...names: Array<StatsItemName>): StatsItemNames {
    return StatsItemNames.ofArray(names);
  }

  protected constructor(names: Sequence<StatsItemName>) {
    this.names = names;
  }

  public get(index: number): Optional<StatsItemName> {
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

  public toString(): string {
    return this.names.toArray().map<string>((name: StatsItemName) => {
      return name.toString();
    }).join(', ');
  }
}