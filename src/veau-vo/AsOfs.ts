import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Collection } from '../veau-general/Collection';
import { Enumerator } from '../veau-general/Type/Enumerator';
import { AsOf } from './AsOf';

export class AsOfs implements Collection<number, AsOf> {
  private asOfs: Array<AsOf>;

  public static of(asOfs: Array<AsOf>): AsOfs {
    return new AsOfs(asOfs);
  }

  private constructor(asOfs: Array<AsOf>) {
    this.asOfs = asOfs;
  }

  public get(index: number): AsOf {
    const asOf: AsOf | undefined = this.asOfs[index];

    if (asOf === undefined) {
      throw new NoSuchElementError(index.toString());
    }

    return asOf;
  }

  public contains(value: AsOf): boolean {
    const found: AsOf | undefined = this.asOfs.find((asOf: AsOf): boolean => {
      if (value.equals(asOf)) {
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
    return this.asOfs.length;
  }

  public forEach(enumerator: Enumerator<number, AsOf>): void {
    this.asOfs.forEach(enumerator);
  }

  public isEmpty(): boolean {
    if (this.asOfs.length === 0) {
      return true;
    }

    return false;
  }

  public equals(other: AsOfs): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.asOfs.length;
    if (length !== other.size()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (!this.asOfs[i].equals(other.get(i))) {
        return false;
      }
    }

    return true;
  }

  public toString(): string {
    return this.asOfs.map<string>((asOf: AsOf): string => {
      return asOf.toString();
    }).join(' ');
  }
}
