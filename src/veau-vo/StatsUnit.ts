import {ValueObject} from '../veau-general/ValueObject';

const DEFAULT_UNIT: string = '';

export class StatsUnit extends ValueObject {
  public readonly noun: 'StatsUnit' = 'StatsUnit';
  private readonly unit: string;

  private static readonly DEFAULT: StatsUnit = StatsUnit.of(DEFAULT_UNIT);

  public static of(unit: string): StatsUnit {
    return new StatsUnit(unit);
  }

  public static default(): StatsUnit {
    return StatsUnit.DEFAULT;
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
    if (this.unit === other.unit) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.unit;
  }
}
