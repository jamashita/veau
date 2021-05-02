import { BinaryPredicate, Catalogue, Mapper, Nullable } from '@jamashita/anden-type';
import { ImmutableSequence, Quantity, ReadonlySequence } from '@jamashita/lluvia-collection';
import { NumericalValue } from './NumericalValue';

export class NumericalValues extends Quantity<number, NumericalValue, 'NumericalValues'> {
  public readonly noun: 'NumericalValues' = 'NumericalValues';
  private readonly vals: ImmutableSequence<NumericalValue>;

  private static readonly EMPTY: NumericalValues = new NumericalValues(ImmutableSequence.empty<NumericalValue>());

  public static empty(): NumericalValues {
    return NumericalValues.EMPTY;
  }

  public static of(values: ReadonlySequence<NumericalValue>): NumericalValues {
    return NumericalValues.ofArray(values.toArray());
  }

  public static ofArray(values: ReadonlyArray<NumericalValue>): NumericalValues {
    if (values.length === 0) {
      return NumericalValues.empty();
    }

    return new NumericalValues(ImmutableSequence.ofArray<NumericalValue>(values));
  }

  public static ofSpread(...values: Array<NumericalValue>): NumericalValues {
    return NumericalValues.ofArray(values);
  }

  protected constructor(values: ImmutableSequence<NumericalValue>) {
    super();
    this.vals = values;
  }

  public contains(value: NumericalValue): boolean {
    return this.vals.contains(value);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof NumericalValues)) {
      return false;
    }

    return this.vals.equals(other.vals);
  }

  public every(predicate: BinaryPredicate<NumericalValue, number>): boolean {
    return this.vals.every(predicate);
  }

  public filter(predicate: BinaryPredicate<NumericalValue, number>): NumericalValues {
    predicate(NumericalValue.of(100), 0);

    const f: ImmutableSequence<NumericalValue> = this.vals.filter(predicate);
    return NumericalValues.of(f);
  }

  public find(predicate: BinaryPredicate<NumericalValue, number>): Nullable<NumericalValue> {
    return this.vals.find(predicate);
  }

  public forEach(catalogue: Catalogue<number, NumericalValue>): void {
    this.vals.forEach(catalogue);
  }

  public get(index: number): Nullable<NumericalValue> {
    return this.vals.get(index);
  }

  public isEmpty(): boolean {
    return this.vals.isEmpty();
  }

  public iterator(): Iterator<[number, NumericalValue]> {
    return this.vals.iterator();
  }

  public map<W>(mapper: Mapper<NumericalValue, W>): ImmutableSequence<W> {
    return this.vals.map<W>(mapper);
  }

  public serialize(): string {
    return this.vals.toString();
  }

  public size(): number {
    return this.vals.size();
  }

  public some(predicate: BinaryPredicate<NumericalValue, number>): boolean {
    return this.vals.some(predicate);
  }

  public values(): Iterable<NumericalValue> {
    return this.vals.values();
  }

  public add(value: NumericalValue): NumericalValues {
    return NumericalValues.of(this.vals.add(value));
  }

  public row(): Array<string> {
    return this.vals.toArray().map<string>((value: NumericalValue) => {
      return value.toString();
    });
  }
}
