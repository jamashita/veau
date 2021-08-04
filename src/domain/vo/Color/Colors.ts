import { BinaryPredicate, Catalogue, Kind, Mapper, Nullable } from '@jamashita/anden-type';
import { Quantity } from '@jamashita/lluvia-collection';
import { ImmutableSequence, ReadonlySequence } from '@jamashita/lluvia-sequence';
import { Color } from './Color.js';

export class Colors extends Quantity<number, Color, 'Colors'> {
  public readonly noun: 'Colors' = 'Colors';
  private readonly colors: ImmutableSequence<Color>;

  private static readonly DEFAULT: Colors = Colors.ofSpread(
    Color.of('#8aa399'),
    Color.of('#7d84b2'),
    Color.of('#8fa6cb'),
    Color.of('#dbf4a7'),
    Color.of('#d5f9de'),
    Color.of('#2b4141'),
    Color.of('#0eb1d2'),
    Color.of('#34e4ea'),
    Color.of('#8ab9b5'),
    Color.of('#c8c2a2'),
    Color.of('#dd7373'),
    Color.of('#3b3561'),
    Color.of('#ead94c'),
    Color.of('#d1d1d1'),
    Color.of('#51a3a3'),
    Color.of('#002500'),
    Color.of('#929982'),
    Color.of('#edcbb1'),
    Color.of('#b7245c'),
    Color.of('#7c3238')
  );

  public static chartScheme(): Colors {
    return Colors.DEFAULT;
  }

  public static of(colors: ReadonlySequence<Color>): Colors {
    return Colors.ofArray(colors.toArray());
  }

  public static ofArray(colors: ReadonlyArray<Color>): Colors {
    return new Colors(ImmutableSequence.ofArray<Color>(colors));
  }

  public static ofSpread(...colors: Array<Color>): Colors {
    return Colors.ofArray(colors);
  }

  protected constructor(colors: ImmutableSequence<Color>) {
    super();
    this.colors = colors;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Colors)) {
      return false;
    }

    return this.colors.equals(other.colors);
  }

  public serialize(): string {
    return this.colors.toString();
  }

  public iterator(): Iterator<[number, Color]> {
    return this.colors.iterator();
  }

  public contains(value: Color): boolean {
    return this.colors.contains(value);
  }

  public every(predicate: BinaryPredicate<Color, number>): boolean {
    return this.colors.every(predicate);
  }

  public filter(predicate: BinaryPredicate<Color, number>): Colors {
    return Colors.of(this.colors.filter(predicate));
  }

  public find(predicate: BinaryPredicate<Color, number>): Nullable<Color> {
    return this.colors.find(predicate);
  }

  public forEach(catalogue: Catalogue<number, Color>): void {
    this.colors.forEach(catalogue);
  }

  public get(index: number): Color {
    const color: Nullable<Color> = this.colors.get(index % this.colors.size());

    if (Kind.isNull(color)) {
      return Color.NO_COLOR;
    }


    return color;
  }

  public override isEmpty(): boolean {
    return this.colors.isEmpty();
  }

  public map<W>(mapper: Mapper<Color, W>): ImmutableSequence<W> {
    return this.colors.map<W>(mapper);
  }

  public size(): number {
    return this.colors.size();
  }

  public some(predicate: BinaryPredicate<Color, number>): boolean {
    return this.colors.some(predicate);
  }

  public values(): Iterable<Color> {
    return this.colors.values();
  }
}
