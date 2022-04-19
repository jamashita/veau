import { BinaryPredicate, Cloneable, ForEach, JSONable, Mapping, Nullable } from '@jamashita/anden-type';
import { Zeit } from '@jamashita/anden-zeit';
import { Quantity } from '@jamashita/lluvia-collection';
import { ImmutableSequence, ReadonlySequence, Sequence } from '@jamashita/lluvia-sequence';
import { Term } from '../Term/Term.js';
import { AsOf } from './AsOf.js';

export class AsOfs extends Quantity<number, AsOf> implements Cloneable<AsOfs>, JSONable<Array<string>> {
  private readonly asOfs: ImmutableSequence<AsOf>;

  private static readonly EMPTY: AsOfs = new AsOfs(ImmutableSequence.empty());

  public static duration(min: AsOf, max: AsOf, term: Term): AsOfs {
    let asOfs: AsOfs = AsOfs.empty();

    asOfs = asOfs.add(min.previous(term));
    for (let asOf: AsOf = min; !asOf.isAfter(max); asOf = asOf.next(term)) {
      asOfs = asOfs.add(asOf);
    }
    asOfs = asOfs.add(max.next(term));

    return asOfs;
  }

  public static empty(): AsOfs {
    return AsOfs.EMPTY;
  }

  public static merge(...asOfsArray: ReadonlyArray<AsOfs>): AsOfs {
    if (asOfsArray.length === 0) {
      return AsOfs.empty();
    }
    if (asOfsArray.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return asOfsArray[0]!;
    }

    const all: Array<Array<AsOf>> = asOfsArray.map((asOfs: AsOfs): Array<AsOf> => {
      return asOfs.asOfs.toArray();
    });

    const merged: Array<AsOf> = [];

    all.forEach((asOfs: Array<AsOf>) => {
      merged.push(...asOfs);
    });

    return AsOfs.ofArray(merged);
  }

  public static of(asOfs: ReadonlySequence<AsOf>): AsOfs {
    return AsOfs.ofArray(asOfs.toArray());
  }

  public static ofArray(asOfs: ReadonlyArray<AsOf>): AsOfs {
    if (asOfs.length === 0) {
      return AsOfs.empty();
    }

    return new AsOfs(ImmutableSequence.ofArray(asOfs));
  }

  public static ofSpread(...asOfs: Array<AsOf>): AsOfs {
    return AsOfs.ofArray(asOfs);
  }

  protected constructor(asOfs: ImmutableSequence<AsOf>) {
    super();
    this.asOfs = asOfs;
  }

  public add(values: AsOf): AsOfs {
    return AsOfs.of(this.asOfs.add(values));
  }

  public contains(value: AsOf): boolean {
    return this.asOfs.contains(value);
  }

  public duplicate(): AsOfs {
    if (this.isEmpty()) {
      return AsOfs.empty();
    }

    return AsOfs.of(this.asOfs.duplicate());
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof AsOfs)) {
      return false;
    }

    return this.asOfs.equals(other.asOfs);
  }

  public every(predicate: BinaryPredicate<AsOf, number>): boolean {
    return this.asOfs.every(predicate);
  }

  public filter(predicate: BinaryPredicate<AsOf, number>): AsOfs {
    return AsOfs.of(this.asOfs.filter(predicate));
  }

  public find(predicate: BinaryPredicate<AsOf, number>): Nullable<AsOf> {
    return this.asOfs.find(predicate);
  }

  public forEach(foreach: ForEach<number, AsOf>): void {
    this.asOfs.forEach(foreach);
  }

  public get(index: number): Nullable<AsOf> {
    return this.asOfs.get(index);
  }

  public override isEmpty(): boolean {
    return this.asOfs.isEmpty();
  }

  public iterator(): Iterator<[number, AsOf]> {
    return this.asOfs[Symbol.iterator]();
  }

  public map<W>(mapping: Mapping<AsOf, W>): ImmutableSequence<W> {
    return this.asOfs.map(mapping);
  }

  public max(): Nullable<AsOf> {
    if (this.isEmpty()) {
      return null;
    }
    if (this.asOfs.size() === 1) {
      return this.asOfs.get(0);
    }

    const zeiten: Sequence<Zeit> = this.asOfs.map((asOf: AsOf): Zeit => {
      return asOf.get();
    });

    try {
      return AsOf.of(Zeit.max(zeiten.toArray(), AsOf.format()));
    }
    catch (err: unknown) {
      return null;
    }
  }

  public min(): Nullable<AsOf> {
    if (this.isEmpty()) {
      return null;
    }
    if (this.asOfs.size() === 1) {
      return this.asOfs.get(0);
    }

    const zeiten: Sequence<Zeit> = this.asOfs.map((asOf: AsOf): Zeit => {
      return asOf.get();
    });

    try {
      return AsOf.of(Zeit.min(zeiten.toArray(), AsOf.format()));
    }
    catch (err: unknown) {
      return null;
    }
  }

  public serialize(): string {
    return this.asOfs.toString();
  }

  public size(): number {
    return this.asOfs.size();
  }

  public some(predicate: BinaryPredicate<AsOf, number>): boolean {
    return this.asOfs.some(predicate);
  }

  public toJSON(): Array<string> {
    return this.asOfs.toArray().map((asOf: AsOf): string => {
      return asOf.toString();
    });
  }

  public values(): Iterable<AsOf> {
    return this.asOfs.values();
  }
}
