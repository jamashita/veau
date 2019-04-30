import * as Chance from 'chance';

export class Random {
  private static chance: Chance.Chance = new Chance();

  public static string(length: number): string {
    return Random.chance.string({
      length
    });
  }

  public static integer(min: number, max: number): number {
    return Random.chance.integer({
      min,
      max
    });
  }

  public static v4(): string {
    return Random.chance.guid({
      version: 4
    });
  }

  public static v5(): string {
    return Random.chance.guid({
      version: 5
    });
  }

  private constructor() {
  }
}
