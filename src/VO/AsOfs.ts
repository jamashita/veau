import { ImmutableSequence } from '../General/Collection/Sequence/ImmutableSequence';
import { Sequence } from '../General/Collection/Sequence/Interface/Sequence';
import { Cloneable } from '../General/Interface/Cloneable';
import { Collection } from '../General/Interface/Collection';
import { JSONable } from '../General/Interface/JSONable';
import { None } from '../General/Optional/None';
import { Optional } from '../General/Optional/Optional';
import { Some } from '../General/Optional/Some';
import { Enumerator } from '../General/Type/Function';
import { Zeit } from '../General/Zeit/Zeit';
import { AsOf } from './AsOf';
import { Term } from './Term';

export class AsOfs implements Collection<number, AsOf>, Cloneable, JSONable {
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
    if (this.asOfs.size() === 1) {
      return this.asOfs.get(0);
    }

    const zeiten: Array<Zeit> = this.asOfs.toArray().map<Zeit>((asOf: AsOf) => {
      return asOf.get();
    });

    const min: Optional<Zeit> = Zeit.min(zeiten, AsOf.format());

    if (min.isAbsent()) {
      return None.of<AsOf>();
    }

    return Some.of<AsOf>(AsOf.of(min.get()));
  }

  public max(): Optional<AsOf> {
    if (this.isEmpty()) {
      return None.of<AsOf>();
    }
    if (this.asOfs.size() === 1) {
      return this.asOfs.get(0);
    }

    const zeiten: Array<Zeit> = this.asOfs.toArray().map<Zeit>((asOf: AsOf) => {
      return asOf.get();
    });

    const max: Optional<Zeit> = Zeit.max(zeiten, AsOf.format());

    if (max.isAbsent()) {
      return None.of<AsOf>();
    }

    return Some.of<AsOf>(AsOf.of(max.get()));
  }

  public size(): number {
    return this.asOfs.size();
  }

  public forEach(iteration: Enumerator<number, AsOf>): void {
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

  public copy(): AsOfs {
    return AsOfs.of(this.asOfs.copy());
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
