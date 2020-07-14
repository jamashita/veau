import {
    CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence
} from '@jamashita/publikum-collection';
import { Cloneable, JSONable } from '@jamashita/publikum-interface';
import { Superposition, Unscharferelation } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { Zeit, ZeitError } from '@jamashita/publikum-zeit';

import { Term } from '../Term/Term';
import { AsOf } from './AsOf';

// TODO TESTS UNDONE
export class AsOfs extends Quantity<AsOfs, number, AsOf, 'AsOfs'> implements Cloneable<AsOfs>, JSONable<Array<string>> {
  public readonly noun: 'AsOfs' = 'AsOfs';
  private readonly asOfs: Sequence<AsOf>;

  private static readonly EMPTY: AsOfs = new AsOfs(ImmutableSequence.empty<AsOf>());

  public static of(asOfs: Sequence<AsOf>): AsOfs {
    if (asOfs.isEmpty()) {
      return AsOfs.empty();
    }

    return new AsOfs(asOfs);
  }

  public static ofArray(asOfs: Array<AsOf>): AsOfs {
    return AsOfs.of(ImmutableSequence.of<AsOf>(asOfs));
  }

  public static ofSpread(...asOfs: Array<AsOf>): AsOfs {
    return AsOfs.ofArray(asOfs);
  }

  public static empty(): AsOfs {
    return AsOfs.EMPTY;
  }

  public static merge(...asOfsArray: Array<AsOfs>): AsOfs {
    if (asOfsArray.length === 0) {
      return AsOfs.empty();
    }
    if (asOfsArray.length === 1) {
      return asOfsArray[0];
    }

    const all: Array<Array<AsOf>> = asOfsArray.map<Array<AsOf>>((asOfs: AsOfs) => {
      return asOfs.asOfs.toArray();
    });

    const merged: Array<AsOf> = [];

    all.forEach((asOfs: Array<AsOf>) => {
      merged.push(...asOfs);
    });

    return AsOfs.ofArray(merged);
  }

  // TODO to normal method
  public static duration(min: AsOf, max: AsOf, term: Term): AsOfs {
    let asOfs: AsOfs = AsOfs.empty();

    asOfs = asOfs.add(min.previous(term));
    for (let asOf: AsOf = min; !asOf.isAfter(max); asOf = asOf.next(term)) {
      asOfs = asOfs.add(asOf);
    }
    asOfs = asOfs.add(max.next(term));

    return asOfs;
  }

  protected constructor(asOfs: Sequence<AsOf>) {
    super();
    this.asOfs = asOfs;
  }

  public add(...values: Array<AsOf>): AsOfs {
    if (values.length === 0) {
      return this;
    }

    return AsOfs.of(this.asOfs.add(...values));
  }

  public get(index: number): Nullable<AsOf> {
    return this.asOfs.get(index);
  }

  public contains(value: AsOf): boolean {
    return this.asOfs.contains(value);
  }

  public min(): Unscharferelation<AsOf> {
    if (this.isEmpty()) {
      return Unscharferelation.absent<AsOf>();
    }
    if (this.asOfs.size() === 1) {
      const asOf: Nullable<AsOf> = this.asOfs.get(0);

      return Unscharferelation.maybe<AsOf>(asOf);
    }

    const zeiten: Array<Zeit> = this.asOfs.toArray().map<Zeit>((asOf: AsOf) => {
      return asOf.get();
    });

    return Superposition.playground<Zeit, ZeitError>(() => {
      return Zeit.min(zeiten, AsOf.format());
    }, ZeitError)
      .map<AsOf, ZeitError>((zeit: Zeit) => {
        return AsOf.of(zeit);
      })
      .toUnscharferelation();
  }

  public max(): Unscharferelation<AsOf> {
    if (this.isEmpty()) {
      return Unscharferelation.absent<AsOf>();
    }
    if (this.asOfs.size() === 1) {
      const asOf: Nullable<AsOf> = this.asOfs.get(0);

      return Unscharferelation.maybe<AsOf>(asOf);
    }

    const zeiten: Array<Zeit> = this.asOfs.toArray().map<Zeit>((asOf: AsOf) => {
      return asOf.get();
    });

    return Superposition.playground<Zeit, ZeitError>(() => {
      return Zeit.max(zeiten, AsOf.format());
    }, ZeitError)
      .map<AsOf, ZeitError>((zeit: Zeit) => {
        return AsOf.of(zeit);
      })
      .toUnscharferelation();
  }

  public size(): number {
    return this.asOfs.size();
  }

  public forEach(iteration: CancellableEnumerator<number, AsOf>): void {
    this.asOfs.forEach(iteration);
  }

  public iterator(): Iterator<Pair<number, AsOf>> {
    return this.asOfs.iterator();
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

  public duplicate(): AsOfs {
    if (this.isEmpty()) {
      return AsOfs.empty();
    }

    return AsOfs.of(this.asOfs.duplicate());
  }

  public toJSON(): Array<string> {
    return this.asOfs.toArray().map<string>((asOf: AsOf) => {
      return asOf.toString();
    });
  }

  public serialize(): string {
    return this.asOfs.toString();
  }
}
