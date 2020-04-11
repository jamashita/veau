import { ValueObject } from '../veau-general/ValueObject';

export class StatsItemName extends ValueObject {
  public readonly noun: 'StatsItemName' = 'StatsItemName';
  private readonly name: string;

  public static of(name: string): StatsItemName {
    return new StatsItemName(name);
  }

  public static default(): StatsItemName {
    return StatsItemName.of('');
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public get(): string {
    return this.name;
  }

  public length(): number {
    return this.name.length;
  }

  public equals(other: StatsItemName): boolean {
    if (this === other) {
      return true;
    }
    if (this.name === other.name) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.name;
  }
}
