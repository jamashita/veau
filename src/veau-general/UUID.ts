import * as Chance from 'chance';

const chance: Chance.Chance = new Chance();

export class UUID {

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

  private constructor() {
  }
}
