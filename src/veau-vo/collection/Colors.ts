import { Color } from '../Color';

export class Colors {
  private colors: Array<Color>;

  public static of(colors: Array<Color>): Colors {
    return new Colors(colors);
  }

  public static chartScheme(): Colors {
    return Colors.of([
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
    ]);
  }

  private constructor(colors: Array<Color>) {
    this.colors = colors;
  }

  public get(index: number): Color {
    const length: number = this.colors.length;

    return this.colors[index % length];
  }
}