import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { Mapper } from '../veau-general/Type/Mapper';
import { StatsItemName } from './StatsItemName';

export type StatsItemNamesJSON = Array<string>;

export class StatsItemNames implements Collection<number, StatsItemName>, JSONable {
  private names: Array<StatsItemName>;

  public static of(names: Array<StatsItemName>): StatsItemNames {
    return new StatsItemNames(names);
  }

  private constructor(names: Array<StatsItemName>) {
    this.names = names;
  }

  public get(index: number): Optional<StatsItemName> {
    const name: StatsItemName | undefined = this.names[index];

    if (name === undefined) {
      return None.of<StatsItemName>();
    }

    return Some.of<StatsItemName>(name);
  }

  public contains(value: StatsItemName): boolean {
    const found: StatsItemName | undefined = this.names.find((name: StatsItemName) => {
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

  public toJSON(): StatsItemNamesJSON {
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
