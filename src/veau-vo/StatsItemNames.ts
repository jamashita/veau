import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { Mapper } from '../veau-general/Type/Function';
import { Ambiguous } from '../veau-general/Type/Value';
import { StatsItemName } from './StatsItemName';

export class StatsItemNames implements Collection<number, StatsItemName>, JSONable {
  public readonly noun: 'StatsItemNames' = 'StatsItemNames';
  private readonly names: Array<StatsItemName>;

  public static of(names: Array<StatsItemName>): StatsItemNames {
    return new StatsItemNames(names);
  }

  private constructor(names: Array<StatsItemName>) {
    this.names = names;
  }

  public [Symbol.iterator](): Iterator<StatsItemName> {
    return this.names[Symbol.iterator]();
  }

  public get(index: number): Optional<StatsItemName> {
    const name: Ambiguous<StatsItemName> = this.names[index];

    if (name === undefined) {
      return None.of<StatsItemName>();
    }

    return Some.of<StatsItemName>(name);
  }

  public contains(value: StatsItemName): boolean {
    const found: Ambiguous<StatsItemName> = this.names.find((name: StatsItemName) => {
      return value.equals(name);
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.names.length;
  }

  public map<U>(mapper: Mapper<StatsItemName, U>): Array<U> {
    return this.names.map<U>(mapper);
  }

  public isEmpty(): boolean {
    if (this.names.length === 0) {
      return true;
    }

    return false;
  }

  public equals(other: StatsItemNames): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.names.length;
    if (length !== other.size()) {
      return false;
    }

    for (let i: number = 0; i < length; i++) {
      if (!this.names[i].equals(other.get(i).get())) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): Array<string> {
    return this.names.map<string>((name: StatsItemName) => {
      return name.get();
    });
  }

  public toString(): string {
    return this.names.map<string>((name: StatsItemName) => {
      return name.toString();
    }).join(', ');
  }
}
