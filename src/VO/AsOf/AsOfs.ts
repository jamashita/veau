import { Collection, ImmutableSequence, Sequence } from '@jamashita/publikum-collection';
import { Cloneable, JSONable } from '@jamashita/publikum-interface';
import { Absent, Present, Quantum, Schrodinger } from '@jamashita/publikum-monad';
import { Objet } from '@jamashita/publikum-object';
import { Enumerator } from '@jamashita/publikum-type';
import { Zeit, ZeitError } from '@jamashita/publikum-zeit';

import { Term } from '../Term/Term';
import { AsOf } from './AsOf';

export class AsOfs extends Objet implements Collection<number, AsOf>, Cloneable<AsOfs>, JSONable {
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

  public get(index: number): Quantum<AsOf> {
    return this.asOfs.get(index);
  }

  public contains(value: AsOf): boolean {
    return this.asOfs.contains(value);
  }

  public min(): Quantum<AsOf> {
    if (this.isEmpty()) {
      return Absent.of<AsOf>();
    }
    if (this.asOfs.size() === 1) {
      return this.asOfs.get(0);
    }

    const zeiten: Array<Zeit> = this.asOfs.toArray().map<Zeit>((asOf: AsOf) => {
      return asOf.get();
    });

    return Schrodinger.playground<Zeit, ZeitError>(() => {
      return Zeit.min(zeiten, AsOf.format());
    }).match<Quantum<AsOf>>(
      (zeit: Zeit) => {
        return Present.of<AsOf>(AsOf.of(zeit));
      },
      () => {
        return Absent.of<AsOf>();
      }
    );
  }

  public max(): Quantum<AsOf> {
    if (this.isEmpty()) {
      return Absent.of<AsOf>();
    }
    if (this.asOfs.size() === 1) {
      return this.asOfs.get(0);
    }

    const zeiten: Array<Zeit> = this.asOfs.toArray().map<Zeit>((asOf: AsOf) => {
      return asOf.get();
    });

    return Schrodinger.playground<Zeit, ZeitError>(() => {
      return Zeit.max(zeiten, AsOf.format());
    }).match<Quantum<AsOf>>(
      (zeit: Zeit) => {
        return Present.of<AsOf>(AsOf.of(zeit));
      },
      () => {
        return Absent.of<AsOf>();
      }
    );
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
