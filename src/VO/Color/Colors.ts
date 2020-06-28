import {
    CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence
} from '@jamashita/publikum-collection';
import { Nullable } from '@jamashita/publikum-type';

import { Color } from './Color';

// TODO TESTS UNDONE
export class Colors extends Quantity<Colors, number, Color, 'Colors'>  {
  public readonly noun: 'Colors' = 'Colors';
  private readonly colors: Sequence<Color>;

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

  public static of(colors: Sequence<Color>): Colors {
    return new Colors(colors);
  }

  public static ofArray(colors: Array<Color>): Colors {
    return Colors.of(ImmutableSequence.of<Color>(colors));
  }

  public static ofSpread(...colors: Array<Color>): Colors {
    return Colors.ofArray(colors);
  }

  public static chartScheme(): Colors {
    return Colors.DEFAULT;
  }

  protected constructor(colors: Sequence<Color>) {
    super();
    this.colors = colors;
  }

  public get(index: number): Nullable<Color> {
    const length: number = this.colors.size();

    return this.colors.get(index % length);
  }

  public contains(value: Color): boolean {
    return this.colors.contains(value);
  }

  public size(): number {
    return this.colors.size();
  }

  public forEach(iteration: CancellableEnumerator<number, Color>): void {
    this.colors.forEach(iteration);
  }

  public iterator(): Iterator<Pair<number, Color>> {
    return this.colors.iterator();
  }

  public isEmpty(): boolean {
    return this.colors.isEmpty();
  }

  public equals(other: Colors): boolean {
    if (this === other) {
      return true;
    }

    return this.colors.equals(other.colors);
  }

  public serialize(): string {
    return this.colors.toString();
  }
}
