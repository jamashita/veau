import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Collection } from '../veau-general/Collection';
import { Enumerator } from '../veau-general/Type/Enumerator';
import { Mapper } from '../veau-general/Type/Mapper';
import { StatsItemName } from './StatsItemName';

export class StatsItemNames implements Collection<number, StatsItemName> {
  private names: Array<StatsItemName>;

  public static of(names: Array<StatsItemName>): StatsItemNames {
    return new StatsItemNames(names);
  }

  private constructor(names: Array<StatsItemName>) {
    this.names = names;
  }

  public get(index: number): StatsItemName {
    const name: StatsItemName | undefined = this.names[index];

    if (name === undefined) {
      throw new NoSuchElementError(index.toString());
    }

    return name;
  }

  public contains(value: StatsItemName): boolean {
    const found: StatsItemName | undefined = this.names.find((name: StatsItemName): boolean => {
      if (value.equals(name)) {
        return true;
      }

      return false;
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.names.length;
  }

  public forEach(enumerator: Enumerator<number, StatsItemName>): void {
    this.names.forEach(enumerator);
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
      if (!this.names[i].equals(other.get(i))) {
        return false;
      }
    }

    return true;
  }

  public toString(): string {
    return this.names.map<string>((name: StatsItemName): string => {
      return name.toString();
    }).join(', ');
  }
}
