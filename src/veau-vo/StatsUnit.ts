import { ValueObject } from './ValueObject';

export class StatsUnit extends ValueObject {
  private unit: string;

  public static of(unit: string): StatsUnit {
    return new StatsUnit(unit);
  }

  private constructor(unit: string) {
    super();
    this.unit = unit;
  }

  public get(): string {
    return this.unit;
  }

  public equals(other: StatsUnit): boolean {
    if (this === other) {
      return true;
    }
    if (this.unit === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.unit;
  }
}
