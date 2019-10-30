import moment from 'moment';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { RuntimeError } from '../veau-general/RuntimeError';
import { Enumerator } from '../veau-general/Type/Enumerator';
import { AsOf } from './AsOf';

export type AsOfJSON = Array<string>;

export class AsOfs implements Collection<number, AsOf>, JSONable {
  private asOfs: Array<AsOf>;

  public static of(asOfs: Array<AsOf>): AsOfs {
    return new AsOfs(asOfs);
  }

  public static empty(): AsOfs {
    return AsOfs.of([
    ]);
  }

  private constructor(asOfs: Array<AsOf>) {
    this.asOfs = asOfs;
  }

  public add(value: AsOf): AsOfs {
    const asOfs: Array<AsOf> = [
      ...this.asOfs,
      value
    ];

    return AsOfs.of(asOfs);
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

  public min(): AsOf {
    if (this.isEmpty()) {
      throw new RuntimeError('THIS IS 0 LENGTH COLLECTION');
    }

    const asOfs: Array<moment.Moment> = this.asOfs.map<moment.Moment>((asOf: AsOf): moment.Moment => {
      return asOf.get();
    });

    return AsOf.of(moment.min(asOfs));
  }

  public max(): AsOf {
    if (this.isEmpty()) {
      throw new RuntimeError('THIS IS 0 LENGTH COLLECTION');
    }

    const asOfs: Array<moment.Moment> = this.asOfs.map<moment.Moment>((asOf: AsOf): moment.Moment => {
      return asOf.get();
    });

    return AsOf.of(moment.max(asOfs));
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

  public toJSON(): AsOfJSON {
    return this.asOfs.map<string>((asOf: AsOf): string => {
      return asOf.getString();
    });
  }

  public toString(): string {
    return this.asOfs.map<string>((asOf: AsOf): string => {
      return asOf.toString();
    }).join(' ');
  }
}
