import { ValueObject } from '@jamashita/anden-object';

const EMPTY_UNIT: string = '';

export class StatsUnit extends ValueObject<'StatsUnit'> {
  public readonly noun: 'StatsUnit' = 'StatsUnit';
  private readonly unit: string;

  private static readonly EMPTY: StatsUnit = new StatsUnit(EMPTY_UNIT);

  public static empty(): StatsUnit {
    return StatsUnit.EMPTY;
  }

  public static of(unit: string): StatsUnit {
    if (unit === EMPTY_UNIT) {
      return StatsUnit.empty();
    }

    return new StatsUnit(unit);
  }

  protected constructor(unit: string) {
    super();
    this.unit = unit;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof StatsUnit)) {
      return false;
    }
    if (this.unit === other.unit) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.unit;
  }

  public get(): string {
    return this.unit;
  }

  public isEmpty(): boolean {
    if (this === StatsUnit.empty()) {
      return true;
    }

    return false;
  }
}
