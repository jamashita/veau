import * as Chance from 'chance';

const chance = new Chance();

export class Random {
  // use with 12
  public static string(length: number): string {
    return chance.string({
      length
    });
  }

  public static integer(min: number, max: number): number {
    return chance.integer({
      min,
      max
    });
  }
}
