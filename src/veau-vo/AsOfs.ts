import moment from 'moment';
import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { Enumerator } from '../veau-general/Type/Function';
import { AsOf } from './AsOf';

export type AsOfJSON = Array<string>;

export class AsOfs implements Collection<number, AsOf>, JSONable {
  public readonly noun: 'AsOfs' = 'AsOfs';
  private readonly asOfs: Array<AsOf>;

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

  public get(index: number): Optional<AsOf> {
    const asOf: AsOf | undefined = this.asOfs[index];

    if (asOf === undefined) {
      return None.of<AsOf>();
    }

    return Some.of<AsOf>(asOf);
  }

  public contains(value: AsOf): boolean {
    const found: AsOf | undefined = this.asOfs.find((asOf: AsOf) => {
      return value.equals(asOf);
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public min(): Optional<AsOf> {
    if (this.isEmpty()) {
      return None.of<AsOf>();
    }

    const asOfs: Array<moment.Moment> = this.asOfs.map<moment.Moment>((asOf: AsOf) => {
      return asOf.get();
    });

    return Some.of<AsOf>(AsOf.of(moment.min(asOfs)));
  }

  public max(): Optional<AsOf> {
    if (this.isEmpty()) {
      return None.of<AsOf>();
    }

    const asOfs: Array<moment.Moment> = this.asOfs.map<moment.Moment>((asOf: AsOf) => {
      return asOf.get();
    });

    return Some.of<AsOf>(AsOf.of(moment.max(asOfs)));
  }

  public size(): number {
    return this.asOfs.length;
  }

  public forEach(iteration: Enumerator<number, AsOf>): void {
    this.asOfs.forEach(iteration);
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
      if (!this.asOfs[i].equals(other.get(i).get())) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): AsOfJSON {
    return this.asOfs.map<string>((asOf: AsOf) => {
      return asOf.toString();
    });
  }

  public toString(): string {
    return this.asOfs.map<string>((asOf: AsOf) => {
      return asOf.toString();
    }).join(', ');
  }
}
