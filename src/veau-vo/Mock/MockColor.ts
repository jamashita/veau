import { Color } from '../Color';

export class MockColor extends Color {

  public constructor(rgb: string = '#ffffff') {
    super(rgb);
  }
}
