import { ValueObject } from '../veau-general/ValueObject';

export class StatsName extends ValueObject {
  public readonly noun: 'StatsName' = 'StatsName';
  private readonly name: string;

  public static of(name: string): StatsName {
    return new StatsName(name);
  }

  public static default(): StatsName {
    return StatsName.of('');
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public get(): string {
    return this.name;
  }

  public equals(other: StatsName): boolean {
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
