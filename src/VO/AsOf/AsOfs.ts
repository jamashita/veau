import { CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence } from '@jamashita/publikum-collection';
import { Cloneable, JSONable } from '@jamashita/publikum-interface';
import { BinaryPredicate, Nullable } from '@jamashita/publikum-type';
import { Zeit } from '@jamashita/publikum-zeit';
import { Term } from '../Term/Term';
import { AsOf } from './AsOf';

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

  public static merge(...asOfsArray: ReadonlyArray<AsOfs>): AsOfs {
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

  public get(index: number): Nullable<AsOf> {
    return this.asOfs.get(index);
  }

  public contains(value: AsOf): boolean {
    return this.asOfs.contains(value);
  }

  public size(): number {
    return this.asOfs.size();
  }

  public forEach(iteration: CancellableEnumerator<number, AsOf>): void {
    this.asOfs.forEach(iteration);
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

  public [Symbol.iterator](): Iterator<Pair<number, AsOf>> {
    return this.asOfs[Symbol.iterator]();
  }

  public every(predicate: BinaryPredicate<AsOf, number>): boolean {
    return this.asOfs.every(predicate);
  }

  public some(predicate: BinaryPredicate<AsOf, number>): boolean {
    return this.asOfs.some(predicate);
  }

  public values(): Iterable<AsOf> {
    return this.asOfs.values();
  }

  public add(values: AsOf): AsOfs {
    return AsOfs.of(this.asOfs.add(values));
  }

  public min(): Nullable<AsOf> {
    if (this.isEmpty()) {
      return null;
    }
    if (this.asOfs.size() === 1) {
      return this.asOfs.get(0);
    }

    const zeiten: Sequence<Zeit> = this.asOfs.map<Zeit>((asOf: AsOf) => {
      return asOf.get();
    });

    try {
      return AsOf.of(Zeit.min(zeiten.toArray(), AsOf.format()));
    }
    catch (err: unknown) {
      return null;
    }
  }

  public max(): Nullable<AsOf> {
    if (this.isEmpty()) {
      return null;
    }
    if (this.asOfs.size() === 1) {
      return this.asOfs.get(0);
    }

    const zeiten: Sequence<Zeit> = this.asOfs.map<Zeit>((asOf: AsOf) => {
      return asOf.get();
    });

    try {
      return AsOf.of(Zeit.max(zeiten.toArray(), AsOf.format()));
    }
    catch (err: unknown) {
      return null;
    }
  }
}
