import moment from 'moment';
import { Collection } from '../veau-general/Collection/Collection';
import { Sequence } from '../veau-general/Collection/Sequence';
import { JSONable } from '../veau-general/JSONable';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { Enumerator } from '../veau-general/Type/Function';
import { AsOf } from './AsOf';

export class AsOfs implements Collection<number, AsOf>, JSONable {
  public readonly noun: 'AsOfs' = 'AsOfs';
  private readonly asOfs: Sequence<AsOf>;

  private static readonly EMPTY: AsOfs = AsOfs.of(Sequence.empty<AsOf>());

  public static of(asOfs: Sequence<AsOf>): AsOfs {
    return new AsOfs(asOfs);
  }

  public static ofArray(asOfs: Array<AsOf>): AsOfs {
    return AsOfs.of(Sequence.of<AsOf>(asOfs));
  }

  public static ofSpread(...asOfs: Array<AsOf>): AsOfs {
    return AsOfs.ofArray(asOfs);
  }

  public static empty(): AsOfs {
    return AsOfs.EMPTY;
  }

  protected constructor(asOfs: Sequence<AsOf>) {
    this.asOfs = asOfs;
  }

  public add(...values: Array<AsOf>): AsOfs {
    return AsOfs.of(this.asOfs.add(...values));
  }

  public get(index: number): Optional<AsOf> {
    return this.asOfs.get(index);
  }

  public contains(value: AsOf): boolean {
    return this.asOfs.contains(value);
  }

  public min(): Optional<AsOf> {
    if (this.isEmpty()) {
      return None.of<AsOf>();
    }

    const asOfs: Array<moment.Moment> = this.asOfs.toArray().map<moment.Moment>((asOf: AsOf) => {
      return asOf.get();
    });

    return Some.of<AsOf>(AsOf.of(moment.min(asOfs)));
  }

  public max(): Optional<AsOf> {
    if (this.isEmpty()) {
      return None.of<AsOf>();
    }

    const asOfs: Array<moment.Moment> = this.asOfs.toArray().map<moment.Moment>((asOf: AsOf) => {
      return asOf.get();
    });

    return Some.of<AsOf>(AsOf.of(moment.max(asOfs)));
  }

  public size(): number {
    return this.asOfs.size();
  }

  public forEach(iteration: Enumerator<number, AsOf>): void {
    this.asOfs.iterate(iteration);
  }

  public isEmpty(): boolean {
    return this.asOfs.isEmpty();
  }

  public equals(other: AsOfs): boolean {
    if (this === other) {
      return true;
    }

    return this.asOfs.equals(other.asOfs);
  }

  public toArray(): Array<AsOf> {
    return this.asOfs.toArray();
  }

  public toJSON(): Array<string> {
    return this.asOfs.toArray().map<string>((asOf: AsOf) => {
      return asOf.toString();
    });
  }

  public toString(): string {
    return this.asOfs.toArray().map<string>((asOf: AsOf) => {
      return asOf.toString();
    }).join(', ');
  }
}
