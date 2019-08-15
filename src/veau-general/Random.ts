import Chance from 'chance';

const chance: Chance.Chance = new Chance();

export class Random {

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

  private constructor() {
  }
}
