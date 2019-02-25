import * as Chance from 'chance';

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

  public static v4(): string {
    return chance.guid({
      version: 4
    });
  }

  public static v5(): string {
    return chance.guid({
      version: 5
    });
  }
}
