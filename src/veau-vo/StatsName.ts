import { ValueObject } from '../veau-general/ValueObject';

export class StatsName extends ValueObject {
  private name: string;

  public static of(name: string): StatsName {
    return new StatsName(name);
  }

  public static default(): StatsName {
    return StatsName.of('');
  }

  private constructor(name: string) {
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
    if (this.name === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.name;
  }
}
